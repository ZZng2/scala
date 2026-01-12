import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

        const supabase = await createClient();

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

            // Fallback: RPC 없으면 클라이언트 사이드 필터링
            const { data: allScholarships, error: fallbackError } = await supabase
                .from('scholarships')
                .select('*')
                .eq('is_closed', false)
                .gte('deadline', new Date().toISOString().split('T')[0])
                .order('deadline', { ascending: true });

            if (fallbackError) {
                return NextResponse.json({ error: fallbackError.message }, { status: 500 });
            }

            // 클라이언트 사이드 필터링
            const filteredData = (allScholarships || []).filter((s: any) => {
                // 1. 소득분위 조건
                if (s.max_income_bracket !== null && income_bracket !== null && income_bracket !== 11) {
                    if (income_bracket > s.max_income_bracket) return false;
                }
                // 2. 성적 조건
                if (s.min_gpa !== null && avg_gpa !== null) {
                    if (avg_gpa < s.min_gpa) return false;
                }
                // 3. 학년 조건
                if (s.target_grades && s.target_grades.length > 0 && grade !== null) {
                    if (!s.target_grades.includes(grade)) return false;
                }
                // 4. 학과 조건
                if (s.target_departments && s.target_departments.length > 0 && department_id) {
                    if (!s.target_departments.includes(department_id)) return false;
                }
                // 5. 지역 조건
                if (s.target_regions && s.target_regions.length > 0 && hometown_region) {
                    if (!s.target_regions.includes(hometown_region)) return false;
                }
                // 6. 특수 조건
                if (s.requires_disability && !has_disability) return false;
                if (s.requires_multi_child && !is_multi_child_family) return false;
                if (s.requires_national_merit && !is_national_merit) return false;

                return true;
            });

            return NextResponse.json({ data: filteredData, matched: false });
        }

        return NextResponse.json({ data, matched: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
