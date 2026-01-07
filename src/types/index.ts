// Scholarship 타입 정의 (PRD scholarships 테이블 기반)
export type ScholarshipCategory = 'tuition' | 'living' | 'mixed';

export interface Scholarship {
    id: string;
    title: string;
    url: string;
    category: ScholarshipCategory;
    amount_text: string | null;
    deadline: string; // ISO Date string
    is_closed: boolean;

    // 필터링 조건
    target_grades: number[] | null;
    target_departments: string[] | null;
    target_colleges: string[] | null;
    min_avg_gpa: number | null;
    min_prev_semester_gpa: number | null;
    max_income_bracket: number | null;
    target_hometown_regions: string[] | null;
    enrollment_status: ('enrolled' | 'on_leave')[] | null;

    // 선택 조건
    requires_disability: boolean;
    requires_multi_child: boolean;
    requires_national_merit: boolean;

    // 메타 정보
    description: string | null;
    documents_required: string | null;
    is_duplicate_allowed: boolean | null;
    push_sent: boolean;

    created_at: string;
    updated_at: string;
}

// 장학금 카드 표시용 간소화 타입
export interface ScholarshipCardData {
    id: string;
    title: string;
    category: ScholarshipCategory;
    amount_text: string;
    deadline: string;
    d_day: number; // 계산된 D-Day 값
    is_closed: boolean;
    is_scrapped?: boolean;
}

// User 타입 정의 (PRD users 테이블 기반)
export interface User {
    id: string;
    email: string;
    name: string | null;
    auth_provider: 'email' | 'kakao' | 'google';

    department_id: string;
    department_name: string;
    college: string;

    grade: 1 | 2 | 3 | 4;
    avg_gpa: number | null;
    prev_semester_gpa: number | null;
    income_bracket: number; // 0-11 (11 = 모름)
    hometown_region: string | null;
    enrollment_status: 'enrolled' | 'on_leave';

    has_disability: boolean;
    is_multi_child_family: boolean;
    is_national_merit: boolean;

    fcm_token: string | null;
    push_enabled: boolean;

    last_login_at: string;
    created_at: string;
    updated_at: string;
}

// Lazy Registration 용 임시 데이터 타입
export interface TempUserData {
    department_id: string;
    department_name: string;
    college: string;
    grade: number;
    avg_gpa: number | null;
    prev_semester_gpa: number | null;
    income_bracket: number;
    hometown_region: string | null;
    enrollment_status: 'enrolled' | 'on_leave';
    has_disability: boolean;
    is_multi_child_family: boolean;
    is_national_merit: boolean;
}

// Department (학과) 타입
export interface Department {
    id: string;
    college: string;
    name: string;
}

// Scrap (찜하기) 타입
export interface Scrap {
    id: string;
    user_id: string;
    scholarship_id: string;
    created_at: string;
}

// Supabase 타입 re-export
export type { Database } from './supabase';
