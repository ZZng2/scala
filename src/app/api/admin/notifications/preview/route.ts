import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {
            target_depts,
            target_grade,
            min_gpa,
            max_income_bracket,
            target_regions,
            special_conditions
        } = await request.json();

        const adminSupabase = createAdminClient();

        // 푸시가 가능한 유저 (fcm_token이 있고 push_enabled가 true) 수를 계산
        // user_profiles와 users를 조인해서 쿼리
        let query = adminSupabase
            .from('user_profiles')
            .select('user_id, users!inner(fcm_token, push_enabled)', { count: 'exact' })
            .not('users.fcm_token', 'is', null)
            .eq('users.push_enabled', true);

        // Apply filters
        if (target_depts && Array.isArray(target_depts) && target_depts.length > 0) {
            query = query.in('department_name', target_depts);
        }

        if (target_grade && Array.isArray(target_grade) && target_grade.length > 0) {
            query = query.in('grade', target_grade);
        }

        if (min_gpa !== undefined && min_gpa !== null && min_gpa > 0) {
            query = query.gte('prev_semester_gpa', min_gpa);
        }

        if (max_income_bracket !== undefined && max_income_bracket !== null) {
            query = query.lte('income_bracket', max_income_bracket);
        }

        if (target_regions && Array.isArray(target_regions) && target_regions.length > 0) {
            query = query.in('hometown_region', target_regions);
        }

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

        const { count, error } = await query;

        if (error) {
            console.error('Preview count error:', error);
            return NextResponse.json({ error: 'Failed to calculate count' }, { status: 500 });
        }

        return NextResponse.json({
            target_count: count || 0
        });

    } catch (error: any) {
        console.error('Preview API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
