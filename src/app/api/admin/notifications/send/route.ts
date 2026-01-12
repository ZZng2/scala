import { createClient, createAdminClient, isAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/fcm-admin';

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const {
            title,
            body,
            // Targeting Fields
            target_dept, // string (partial match) (deprecated mostly, but keep for compatibility if needed, or replace with exact array if UI changes to multi-select)
            target_depts, // string[] (exact match) - New
            target_grade, // number[]
            min_gpa, // number
            max_income_bracket, // number
            target_regions, // string[]
            special_conditions, // { is_multi_child: boolean, has_disability: boolean, is_national_merit: boolean }
            scholarship_id
        } = await request.json();

        // 1. Check Session (Admin Check)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Build Query for User Filtering
        let query = supabase.from('user_profiles').select('user_id', { count: 'exact' });

        // (1) Departments: Support both legacy single string and new array
        if (target_depts && Array.isArray(target_depts) && target_depts.length > 0) {
            query = query.in('department_name', target_depts);
        } else if (target_dept) {
            query = query.ilike('department_name', `%${target_dept}%`);
        }

        // (2) Grade
        if (target_grade && Array.isArray(target_grade) && target_grade.length > 0) {
            query = query.in('grade', target_grade);
        }

        // (3) GPA (>=)
        if (min_gpa !== undefined && min_gpa !== null && min_gpa > 0) {
            query = query.gte('prev_semester_gpa', min_gpa);
        }

        // (4) Income Bracket (<=)
        if (max_income_bracket !== undefined && max_income_bracket !== null) {
            query = query.lte('income_bracket', max_income_bracket);
        }

        // (5) Regions (IN)
        if (target_regions && Array.isArray(target_regions) && target_regions.length > 0) {
            query = query.in('hometown_region', target_regions);
        }

        // (6) Special Conditions (AND logic for checked items)
        if (special_conditions) {
            if (special_conditions.is_multi_child) {
                query = query.eq('is_multi_child_family', true);
            }
            if (special_conditions.has_disability) {
                query = query.eq('has_disability', true);
            }
            if (special_conditions.is_national_merit) {
                query = query.eq('is_national_merit', true);
            }
        }

        // Execute Count Query
        const { count, error: countError } = await query;

        if (countError) {
            console.error('Target calc error:', countError);
            throw new Error('Failed to calculate target users');
        }

        // 3. Create Admin Client for DB operations
        const adminSupabase = createAdminClient();

        // 4. Log to push_logs table (using admin client to bypass RLS)
        const { data: insertData, error: insertError } = await adminSupabase
            .from('push_logs')
            .insert({
                title,
                body,
                scholarship_id: scholarship_id || null,
                target_user_count: count || 0,
                sent_at: new Date().toISOString(),
                clicked_count: 0
            })
            .select()
            .single();

        if (insertError) {
            console.error('Log insert error:', insertError);
            throw new Error('Failed to save push log');
        }

        // 5. Send Actual Push Notification via FCM

        // 유효한 fcm_token을 가진 유저 목록 가져오기 (필터링 조건 유지)
        const { data: users, error: userError } = await query
            .select('user_id, users!inner(fcm_token, push_enabled)')
            .not('users.fcm_token', 'is', null)
            .eq('users.push_enabled', true);

        if (userError) {
            console.error('Failed to fetch user tokens:', userError);
            throw new Error('Failed to fetch user tokens for push');
        }

        const tokens = (users as any[])
            .map(u => u.users?.fcm_token)
            .filter(Boolean);

        console.log(`[AdminPush] Sending to ${tokens.length} users (Filtered from ${count} targeting)`);

        let successCount = 0;
        let failureCount = 0;

        if (tokens.length > 0) {
            const result = await sendPushNotification(
                tokens,
                title,
                body,
                scholarship_id
            );
            successCount = result.success;
            failureCount = result.failure;
        }

        // 5. Update Log with results
        await adminSupabase
            .from('push_logs')
            .update({
                sent_count: successCount,
                failure_count: failureCount,
                status: 'completed'
            })
            .eq('id', insertData.id);

        return NextResponse.json({
            success: true,
            target_count: count,
            sent_count: successCount,
            failure_count: failureCount,
            log_id: insertData.id
        });

    } catch (error: any) {
        console.error('Notification API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
