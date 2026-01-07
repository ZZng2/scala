import { Scholarship } from './types';

export const MOCK_SCHOLARSHIP: Scholarship = {
  id: '1',
  title: '2026학년도 1학기 불교청년지도자 장학금',
  category: 'mixed',
  amount_text: '등록금 전액 + 학업장려금 50만원',
  deadline: '2026-02-15',
  d_day: 40,
  target_summary: '불교대학 및 일반대학원 재학생',
  organization: '대한불교조계종 장학위원회',
  description: `
    불교청년지도자 육성을 위해 2026학년도 1학기 장학생을 선발합니다.
    본 장학금은 등록금성 장학금과 생활비성 장학금이 혼합된 형태입니다.
    
    1. 선발 인원: O명
    2. 지원 자격:
       - 2026학년도 1학기 등록 예정자
       - 직전 학기 평점 3.0 이상 (4.5 만점 기준)
       - 소득분위 8구간 이하
       - 대한불교조계종 신도증 소지자 우대
  `,
  documents_required: `
    1. 장학지원서 1부 (소정 양식)
    2. 자기소개서 1부
    3. 재학증명서 1부
    4. 성적증명서 1부
    5. 가족관계증명서 1부
    6. 소득구간 확인서 1부
  `,
  is_duplicate_allowed: true,
  support_conditions: '학부 재학생 (1~4학년), 대학원생 가능',
  views: 1240,
  is_scrapped: false,
  link: 'https://www.dongguk.edu/article/SCHOLARSHIP/detail/123456'
};
