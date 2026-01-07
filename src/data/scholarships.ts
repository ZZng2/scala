import { ScholarshipCardData } from '@/types';

/**
 * Mock 장학금 데이터
 * 실제 서비스에서는 Supabase에서 조회
 */
export const mockScholarships: Omit<ScholarshipCardData, 'd_day'>[] = [
    {
        id: '1',
        title: '2026학년도 1학기 불교청년지도자 장학금',
        category: 'mixed',
        amount_text: '등록금 전액 + 학업장려금 50만원',
        deadline: '2026-02-15',
        is_closed: false,
    },
    {
        id: '2',
        title: '동국대학교 성적우수 장학금 (A형)',
        category: 'tuition',
        amount_text: '등록금 전액',
        deadline: '2026-01-20',
        is_closed: false,
    },
    {
        id: '3',
        title: '저소득층 학생 생활비 지원 장학금',
        category: 'living',
        amount_text: '월 50만원 (6개월)',
        deadline: '2026-01-25',
        is_closed: false,
    },
    {
        id: '4',
        title: '교내 근로장학금 (학기당)',
        category: 'living',
        amount_text: '최대 100만원',
        deadline: '2026-02-01',
        is_closed: false,
    },
    {
        id: '5',
        title: '다자녀 가정 지원 장학금',
        category: 'mixed',
        amount_text: '등록금 50% + 생활비 30만원',
        deadline: '2026-02-10',
        is_closed: false,
    },
    {
        id: '6',
        title: '지역인재 육성 장학금 (경기도)',
        category: 'tuition',
        amount_text: '등록금 80%',
        deadline: '2026-01-15',
        is_closed: false,
    },
];
