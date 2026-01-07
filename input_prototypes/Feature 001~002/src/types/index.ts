export interface Department {
  id: string;
  college: string;
  name: string;
}

export interface UserData {
  department_id: string;
  department_name: string;
  college: string;
  grade: number; // 1-4
  avg_gpa?: number; // 0-4.5
  prev_semester_gpa?: number; // 0-4.5
  income_bracket: number; // 0-11 (11 = don't know)
  hometown_region?: string;
  enrollment_status: 'enrolled' | 'on_leave';
  has_disability: boolean;
  is_multi_child_family: boolean;
  is_national_merit: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  amount_text: string;
  category: 'tuition' | 'living' | 'mixed';
  deadline: string; // ISO date string
  d_day?: number; // calculated
  tags: string[];
}
