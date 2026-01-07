import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { title, body, target_dept, target_grade, scholarship_id } = await request.json();

        // 1. Check Session (Admin Check assumed or basic auth)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Calculate Target Users (Targeting Logic)
        let query = supabase.from('user_profiles').select('user_id', { count: 'exact' });

        if (target_dept) {
            query = query.ilike('department_name', `%${target_dept}%`);
        }

        if (target_grade && Array.isArray(target_grade) && target_grade.length > 0) {
            query = query.in('grade', target_grade);
        }

        const { count, error: countError } = await query;

        if (countError) {
            console.error('Target calc error:', countError);
            throw new Error('Failed to calculate target users');
        }

        // 3. Log to push_logs table
        const { data: insertData, error: insertError } = await supabase
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

        // 4. (Simulation) Send Push Notification
        // In reality, we would loop through user tokens and call FCM/WebPush here.
        // For now, we assume success.

        return NextResponse.json({
            success: true,
            sent_count: count,
            log_id: insertData.id
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
