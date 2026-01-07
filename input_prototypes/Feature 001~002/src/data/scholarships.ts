import { Scholarship } from '../types';

export const mockScholarships: Scholarship[] = [
  {
    id: 's1',
    title: '2024학년도 1학기 동국건학장학',
    amount_text: '등록금 전액',
    category: 'tuition',
    deadline: '2026-02-15',
    tags: ['성적우수', '등록금'],
  },
  {
    id: 's2',
    title: '동국사랑 장학금(가계곤란)',
    amount_text: '100만원',
    category: 'living',
    deadline: '2026-03-01',
    tags: ['소득분위', '생활비'],
  },
  {
    id: 's3',
    title: '국가장학금 1유형',
    amount_text: '소득구간별 차등',
    category: 'tuition',
    deadline: '2026-01-20',
    tags: ['한국장학재단', '국가장학금'],
  },
  {
    id: 's4',
    title: '교외장학금(DB김준기문화재단)',
    amount_text: '학기당 200만원',
    category: 'mixed',
    deadline: '2026-01-31',
    tags: ['외부장학금', '리더십'],
  },
  {
    id: 's5',
    title: '학업장려 장학금',
    amount_text: '50만원',
    category: 'living',
    deadline: '2026-04-10',
    tags: ['성적향상'],
  },
];
