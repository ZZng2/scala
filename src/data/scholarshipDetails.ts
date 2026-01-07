import { Scholarship } from '@/types';

/**
 * Mock 장학금 상세 데이터
 * 실제 서비스에서는 Supabase에서 ID로 조회
 */
export const mockScholarshipDetails: Record<string, Partial<Scholarship> & {
    organization?: string;
    target_summary?: string;
    support_conditions?: string;
}> = {
    '1': {
        id: '1',
        title: '2026학년도 1학기 불교청년지도자 장학금',
        category: 'mixed',
        amount_text: '등록금 전액 + 학업장려금 50만원',
        deadline: '2026-02-15',
        is_closed: false,
        organization: '대한불교조계종 장학위원회',
        target_summary: '불교대학 및 일반대학원 재학생',
        description: `불교청년지도자 육성을 위해 2026학년도 1학기 장학생을 선발합니다.
본 장학금은 등록금성 장학금과 생활비성 장학금이 혼합된 형태입니다.

1. 선발 인원: O명
2. 지원 자격:
   - 2026학년도 1학기 등록 예정자
   - 직전 학기 평점 3.0 이상 (4.5 만점 기준)
   - 소득분위 8구간 이하
   - 대한불교조계종 신도증 소지자 우대`,
        documents_required: `1. 장학지원서 1부 (소정 양식)
2. 자기소개서 1부
3. 재학증명서 1부
4. 성적증명서 1부
5. 가족관계증명서 1부
6. 소득구간 확인서 1부`,
        is_duplicate_allowed: true,
        support_conditions: '학부 재학생 (1~4학년), 대학원생 가능',
    },
    '2': {
        id: '2',
        title: '동국대학교 성적우수 장학금 (A형)',
        category: 'tuition',
        amount_text: '등록금 전액',
        deadline: '2026-01-20',
        is_closed: false,
        organization: '동국대학교 학생처',
        target_summary: '직전 학기 성적 상위 3% 이내 재학생',
        description: `성적이 우수한 재학생에게 등록금 전액을 지원합니다.

지원 자격:
- 직전 학기 이수학점 15학점 이상
- 직전 학기 평점 4.3 이상
- 학과 성적 상위 3% 이내`,
        documents_required: `1. 장학금 신청서
2. 성적증명서`,
        is_duplicate_allowed: false,
        support_conditions: '재학생 (1학년 2학기 ~ 4학년 2학기)',
    },
    '3': {
        id: '3',
        title: '저소득층 학생 생활비 지원 장학금',
        category: 'living',
        amount_text: '월 50만원 (6개월)',
        deadline: '2026-01-25',
        is_closed: false,
        organization: '동국대학교 학생처',
        target_summary: '소득분위 3구간 이하 재학생',
        description: `저소득층 학생의 학업 전념을 위해 생활비를 지원합니다.

지원 자격:
- 소득분위 3구간 이하
- 직전 학기 평점 2.5 이상`,
        documents_required: `1. 장학금 신청서
2. 소득구간 확인서
3. 성적증명서`,
        is_duplicate_allowed: true,
        support_conditions: '소득분위 3구간 이하',
    },
    '4': {
        id: '4',
        title: '교내 근로장학금 (학기당)',
        category: 'living',
        amount_text: '최대 100만원',
        deadline: '2026-02-01',
        is_closed: false,
        organization: '동국대학교 학생처',
        target_summary: '근로를 통해 학비를 마련하고자 하는 재학생',
        description: `교내 각 부서에서 근로활동을 수행하고 장학금을 받습니다.

- 시급: 12,000원
- 월 최대 40시간 근무 가능`,
        documents_required: `1. 근로장학금 신청서
2. 시간표`,
        is_duplicate_allowed: true,
        support_conditions: '재학생 전체',
    },
    '5': {
        id: '5',
        title: '다자녀 가정 지원 장학금',
        category: 'mixed',
        amount_text: '등록금 50% + 생활비 30만원',
        deadline: '2026-02-10',
        is_closed: false,
        organization: '동국대학교 학생처',
        target_summary: '3자녀 이상 다자녀 가정 재학생',
        description: `다자녀 가정의 교육비 부담을 줄이기 위한 장학금입니다.

지원 자격:
- 3자녀 이상 가정
- 직전 학기 평점 2.0 이상`,
        documents_required: `1. 장학금 신청서
2. 가족관계증명서
3. 성적증명서`,
        is_duplicate_allowed: true,
        support_conditions: '다자녀 가정 (3자녀 이상)',
    },
    '6': {
        id: '6',
        title: '지역인재 육성 장학금 (경기도)',
        category: 'tuition',
        amount_text: '등록금 80%',
        deadline: '2026-01-15',
        is_closed: false,
        organization: '경기도청',
        target_summary: '경기도 출신 고교 졸업 재학생',
        description: `경기도 지역 인재 육성을 위한 장학금입니다.

지원 자격:
- 경기도 소재 고등학교 졸업
- 직전 학기 평점 3.0 이상`,
        documents_required: `1. 장학금 신청서
2. 고등학교 졸업증명서
3. 성적증명서`,
        is_duplicate_allowed: false,
        support_conditions: '경기도 출신',
    },
};
