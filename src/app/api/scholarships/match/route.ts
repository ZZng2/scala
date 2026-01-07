import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * POST /api/scholarships/match
 * 사용자 조건에 맞는 장학금 매칭
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            grade,
            avg_gpa,
            income_bracket,
            department_id,
            hometown_region,
            has_disability,
            is_multi_child_family,
            is_national_merit,
        } = body;

        const supabase = createServerClient();

        // 매칭 함수 호출
        const { data, error } = await supabase.rpc('match_scholarships', {
            p_grade: grade,
            p_gpa: avg_gpa,
            p_income_bracket: income_bracket,
            p_department_id: department_id,
            p_region: hometown_region,
            p_has_disability: has_disability || false,
            p_is_multi_child: is_multi_child_family || false,
            p_is_national_merit: is_national_merit || false,
        });

        if (error) {
            console.error('Error matching scholarships:', error);

            // Fallback: RPC 없으면 기본 쿼리
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('scholarships')
                .select('id, title, category, amount_text, deadline, is_closed')
                .eq('is_closed', false)
                .gte('deadline', new Date().toISOString().split('T')[0])
                .order('deadline', { ascending: true });

            if (fallbackError) {
                return NextResponse.json({ error: fallbackError.message }, { status: 500 });
            }

            return NextResponse.json({ data: fallbackData, matched: false });
        }

        return NextResponse.json({ data, matched: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
