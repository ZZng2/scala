export interface Scholarship {
  id: string;
  title: string;
  category: 'tuition' | 'living' | 'mixed';
  amount_text: string;
  deadline: string;
  d_day: number;
  target_summary: string;
  
  // Details
  description: string;
  documents_required: string;
  is_duplicate_allowed: boolean;
  support_conditions: string; // e.g., Grade, GPA
  
  // Meta
  organization: string;
  views: number;
  is_scrapped: boolean;
  link: string;
}
