-- ============================================
-- Scala Database Schema (Supabase)
-- PRD 기반 테이블 생성 스크립트
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== 1. Users 테이블 ==========
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  fcm_token TEXT,
  push_enabled BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  -- 온보딩 관련 필드 (Step 2)
  admission_year INTEGER, -- 입학년도 (2026년 입학생 = 새내기, 학점 0 처리)
  is_interview_agreed BOOLEAN DEFAULT FALSE, -- 인터뷰 동의 여부
  onboarding_completed BOOLEAN DEFAULT FALSE -- 온보딩 완료 여부
);

-- ========== 2. User Profiles 테이블 ==========
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  department_id TEXT,
  department_name TEXT,
  college TEXT,
  grade INTEGER CHECK (grade >= 1 AND grade <= 4),
  enrollment_status TEXT CHECK (enrollment_status IN ('enrolled', 'on_leave')),
  avg_gpa DECIMAL(3, 2) CHECK (avg_gpa >= 0 AND avg_gpa <= 4.5),
  prev_semester_gpa DECIMAL(3, 2) CHECK (prev_semester_gpa >= 0 AND prev_semester_gpa <= 4.5),
  income_bracket INTEGER CHECK (income_bracket >= 0 AND income_bracket <= 11),
  hometown_region TEXT,
  has_disability BOOLEAN DEFAULT FALSE,
  is_multi_child_family BOOLEAN DEFAULT FALSE,
  is_national_merit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ========== 3. Scholarships 테이블 ==========
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tuition', 'living', 'mixed')),
  amount_text TEXT,
  deadline DATE NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  organization TEXT,
  target_summary TEXT,
  support_conditions TEXT,
  description TEXT,
  documents_required TEXT,
  is_duplicate_allowed BOOLEAN,
  url TEXT,
  -- 필터링 조건
  min_gpa DECIMAL(3, 2),
  max_income_bracket INTEGER,
  target_grades INTEGER[],
  target_departments TEXT[],
  target_regions TEXT[],
  requires_disability BOOLEAN DEFAULT FALSE,
  requires_multi_child BOOLEAN DEFAULT FALSE,
  requires_national_merit BOOLEAN DEFAULT FALSE,
  -- 메타데이터
  views INTEGER DEFAULT 0,
  scraps INTEGER DEFAULT 0,
  push_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 4. Scraps 테이블 ==========
CREATE TABLE IF NOT EXISTS public.scraps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- ========== 5. Push Logs 테이블 ==========
CREATE TABLE IF NOT EXISTS public.push_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_user_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 6. Notifications 테이블 (사용자별 알림 수신 내역) ==========
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 6. Click Events 테이블 (Analytics) ==========
CREATE TABLE IF NOT EXISTS public.click_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE SET NULL,
  push_log_id UUID REFERENCES public.push_logs(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== 인덱스 ==========
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON public.scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_closed ON public.scholarships(is_closed);
CREATE INDEX IF NOT EXISTS idx_scraps_user_id ON public.scraps(user_id);
CREATE INDEX IF NOT EXISTS idx_scraps_scholarship_id ON public.scraps(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_click_events_user_id ON public.click_events(user_id);
CREATE INDEX IF NOT EXISTS idx_click_events_event_type ON public.click_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- ========== RLS (Row Level Security) ==========

-- Users: 본인만 조회/수정 가능, 신규 사용자는 자신의 레코드 생성 가능
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User Profiles: 본인만 조회/수정 가능
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Scholarships: 모든 사용자 조회 가능, 관리자만 수정
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view scholarships" ON public.scholarships
  FOR SELECT USING (true);

-- Scraps: 본인만 조회/수정 가능
ALTER TABLE public.scraps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scraps" ON public.scraps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scraps" ON public.scraps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scraps" ON public.scraps
  FOR DELETE USING (auth.uid() = user_id);

-- Push Logs: 관리자만 접근 (서버에서만 사용)
ALTER TABLE public.push_logs ENABLE ROW LEVEL SECURITY;

-- Notifications: 본인 것만 조회 가능
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Click Events: 본인만 삽입 가능
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own events" ON public.click_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ========== 함수: 장학금 매칭 ==========
CREATE OR REPLACE FUNCTION public.match_scholarships(
  p_grade INTEGER,
  p_gpa DECIMAL,
  p_income_bracket INTEGER,
  p_department_id TEXT,
  p_region TEXT,
  p_has_disability BOOLEAN,
  p_is_multi_child BOOLEAN,
  p_is_national_merit BOOLEAN
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  amount_text TEXT,
  deadline DATE,
  is_closed BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.title,
    s.category,
    s.amount_text,
    s.deadline,
    s.is_closed
  FROM public.scholarships s
  WHERE 
    s.is_closed = FALSE
    AND s.deadline >= CURRENT_DATE
    AND (s.min_gpa IS NULL OR p_gpa >= s.min_gpa)
    AND (s.max_income_bracket IS NULL OR p_income_bracket <= s.max_income_bracket)
    AND (s.target_grades IS NULL OR p_grade = ANY(s.target_grades))
    AND (s.target_departments IS NULL OR p_department_id = ANY(s.target_departments))
    AND (s.target_regions IS NULL OR p_region = ANY(s.target_regions))
    AND (s.requires_disability = FALSE OR p_has_disability = TRUE)
    AND (s.requires_multi_child = FALSE OR p_is_multi_child = TRUE)
    AND (s.requires_national_merit = FALSE OR p_is_national_merit = TRUE)
  ORDER BY s.deadline ASC;
END;
$$;

-- ========== Updated At Trigger ==========
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
