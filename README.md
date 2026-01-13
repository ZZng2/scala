# Scala - 동국대 맞춤 장학금 알림 서비스

> **"놓치면 손해, 받으면 최대 400만 원"**  
> 동국대학교 학생들을 위한 개인화된 장학금 매칭 및 PUSH 알림 서비스

---

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Scala (스칼라) |
| **타겟 유저** | 동국대학교 재학생 |
| **핵심 가치** | 맞춤형 장학금 추천 + 신규 공고 PUSH 알림 |
| **플랫폼** | Web (PWA, Mobile-First) |

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4.0 |
| **UI Components** | shadcn/ui (Radix UI 기반) |
| **Animation** | motion (framer-motion 계열) |
| **Backend** | Supabase (Auth, Database, Edge Functions) |
| **State** | Zustand (예정) |
| **Notifications** | Firebase Cloud Messaging (FCM) |
| **Deployment** | Vercel (예정) |

---

## 📁 프로젝트 구조

```
scala/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx            # 라우팅 분기점 (조건부 리다이렉트)
│   │   ├── landing/            # Feature 0: 랜딩 페이지
│   │   ├── onboarding/         # Feature 1: 데이터 입력 (5단계)
│   │   ├── home/               # Feature 2: 개인화 홈 피드
│   │   ├── scholarship/[id]/   # Feature 3: 장학금 상세
│   │   ├── signup/             # Feature 4: 회원가입
│   │   ├── login/              # Feature 4: 로그인
│   │   ├── scraps/             # Feature 5: 찜 목록
│   │   ├── profile/edit/       # Feature 5: 내 정보 수정
│   │   ├── admin/              # Feature 6-8: 관리자 페이지
│   │   │   ├── page.tsx        # 대시보드
│   │   │   ├── scholarships/   # 장학금 관리
│   │   │   ├── push/           # PUSH 발송
│   │   │   └── settings/       # 설정
│   │   └── api/                # API Routes
│   │       ├── scholarships/   # 장학금 CRUD + 매칭
│   │       ├── scraps/         # 스크랩 관리
│   │       ├── users/          # 사용자 프로필
│   │       ├── analytics/      # 이벤트 트래킹
│   │       └── push/           # PUSH 발송
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── common/             # 공통 컴포넌트 (Header, Card, Badge 등)
│   │   ├── landing/            # 랜딩 페이지 컴포넌트
│   │   ├── onboarding/         # 온보딩 스텝 컴포넌트
│   │   ├── home/               # 홈 피드 컴포넌트
│   │   ├── scholarship/        # 상세 페이지 컴포넌트
│   │   └── admin/              # 관리자 컴포넌트
│   │
│   ├── lib/
│   │   ├── utils.ts            # 유틸 함수 (cn, 등)
│   │   └── supabase/           # Supabase 클라이언트
│   │
│   ├── data/                   # 정적 데이터
│   │   ├── departments.ts      # 동국대 학과 목록 (58개)
│   │   ├── scholarships.ts     # Mock 장학금 데이터
│   │   └── scholarshipDetails.ts
│   │
│   └── types/                  # TypeScript 타입 정의
│       ├── index.ts            # 공통 타입
│       └── supabase.ts         # DB 스키마 타입
│
├── supabase/
│   └── schema.sql              # DB 스키마 (테이블, RLS, 함수)
│
├── input_prototypes/           # 원본 Figma 프로토타입 코드
│   ├── Feature 0/              # 랜딩
│   ├── Feature 001~002/        # 온보딩 + 홈피드
│   └── Feature 3/              # 상세
│
├── PRD/
│   └── integrated_PRD.md       # 제품 요구사항 문서 (PRD)
│
└── .env.example                # 환경변수 예시
```

---

## 🚀 개발 환경 설정

### 1. 의존성 설치

```bash
cd scala
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 수정:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FCM_SERVER_KEY=your-fcm-server-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 접속

---

## 📱 라우팅 & 사용자 플로우

### 메인 라우팅 로직 (`src/app/page.tsx`)

```
사용자 접속
    │
    ├─ Token 있음 (회원) ───────────────────→ /home
    │
    ├─ Token 없음 + temp_user_data 있음 ──→ /home (StickyBar 표시)
    │
    └─ Token 없음 + temp_user_data 없음 ──→ /landing
```

### 사용자 플로우

1. **신규 방문** → `/landing` → CTA 클릭 → `/onboarding`
2. **온보딩 완료** → 데이터 localStorage 저장 → `/home`
3. **장학금 클릭** → `/scholarship/[id]` → 찜하기/지원하기
4. **회원가입** → `/signup` → 소셜 로그인 → 데이터 DB 이관
5. **마이페이지** → `/scraps`, `/profile/edit`

---

## ✅ 구현 완료된 기능 (Phase 1-5)

### Phase 1: 프로젝트 셋업 ✅
- [x] Next.js 16.1 + TypeScript
- [x] Tailwind CSS 4.0
- [x] shadcn/ui 컴포넌트
- [x] 디자인 시스템 (globals.css)

### Phase 2: 공통 컴포넌트 ✅
- [x] Header (GNB + Profile Popover)
- [x] ScholarshipCard
- [x] StickyBar / StickyActionBar
- [x] Button, Badge, Input, Select, Card
- [x] Toast (Sonner)

### Phase 3: User-Facing 페이지 ✅

| Feature | 페이지 | 설명 |
|---------|--------|------|
| **0** | `/landing` | 스크롤 애니메이션, 베네핏, 실시간 티커 |
| **1** | `/onboarding` | 5단계 폼 (학과→학년→GPA→소득→거주지) |
| **2** | `/home` | 맞춤 장학금 리스트, D-Day 정렬 |
| **3** | `/scholarship/[id]` | 상세 정보, 찜하기, 지원 버튼 |
| **4** | `/signup`, `/login` | 카카오/구글 소셜, 이메일 Magic Link |
| **5** | `/scraps`, `/profile/edit` | 찜 목록, 프로필 수정, PUSH 토글 |

### Phase 4: Admin 페이지 ✅

| 페이지 | 설명 |
|--------|------|
| `/admin` | 대시보드 (MAU, CTR, 차트) |
| `/admin/scholarships` | 장학금 테이블 + 필터 |
| `/admin/push` | PUSH 발송 (대상 선택, 에디터, 미리보기) |
| `/admin/settings` | Supabase/FCM 설정 |

### Phase 5: Supabase 백엔드 ✅

| 항목 | 파일 |
|------|------|
| DB 스키마 | `supabase/schema.sql` |
| 타입 정의 | `src/types/supabase.ts` |
| API Routes | `src/app/api/*` |

#### API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/scholarships` | 장학금 목록 |
| POST | `/api/scholarships` | 장학금 등록 |
| GET | `/api/scholarships/[id]` | 장학금 상세 |
| PATCH | `/api/scholarships/[id]` | 장학금 수정 |
| DELETE | `/api/scholarships/[id]` | 장학금 삭제 |
| POST | `/api/scholarships/match` | 맞춤 매칭 |
| GET/POST/DELETE | `/api/scraps` | 스크랩 관리 |
| GET/POST | `/api/users/profile` | 프로필 관리 |
| POST | `/api/analytics/event` | 이벤트 기록 |
| POST | `/api/push/send` | PUSH 발송 |

---

## ⏳ 남은 작업 (Phase 6+)

### Phase 6: 추가 최적화 (Optional)
- [ ] E2E 테스트 (Playwright)
- [ ] Lighthouse Performance 최적화
- [ ] 다국어 지원 (i18n)

---

## 🔧 Supabase 설정 가이드

### 1. 프로젝트 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. New Project 생성
3. Project Settings → API → URL, anon key, service_role key 복사

### 2. 스키마 적용
1. SQL Editor 열기
2. `supabase/schema.sql` 내용 전체 복사 → 실행
3. 테이블 6개 생성 확인:
   - `users`
   - `user_profiles`
   - `scholarships`
   - `scraps`
   - `push_logs`
   - `click_events`

### 3. RLS 확인
- 모든 테이블에 RLS 활성화됨
- `scholarships`: 모두 조회 가능
- 나머지: 본인 데이터만 접근

---

## 📝 코드 컨벤션

### 파일 네이밍
- 컴포넌트: `PascalCase.tsx` (예: `ScholarshipCard.tsx`)
- 페이지: `page.tsx` (App Router 규칙)
- 훅: `use*.ts` (예: `useAuth.ts`)
- 유틸: `camelCase.ts`

### 컴포넌트 구조
```tsx
'use client'; // 클라이언트 컴포넌트인 경우

import React from 'react';

interface ComponentProps {
  // props 정의
}

/**
 * ComponentName
 * 컴포넌트 설명
 */
export function ComponentName({ ...props }: ComponentProps) {
  return (
    // JSX
  );
}
```

### 스타일링
- Tailwind CSS 클래스 사용
- 디자인 토큰: `globals.css`의 CSS 변수 참조
- 색상: `#FF6B35` (Primary Orange), `#212121` (Text), `#757575` (Secondary)

---

## 🎨 디자인 시스템

### 색상
| 이름 | Hex | 용도 |
|------|-----|------|
| Primary | `#FF6B35` | 버튼, 강조, 링크 |
| Primary Hover | `#E55A2A` | Primary 호버 |
| Background | `#FFFFFF` | 배경 |
| Surface | `#F8F9FA` | 카드 배경 |
| Text Primary | `#212121` | 본문 |
| Text Secondary | `#757575` | 보조 텍스트 |
| Border | `#E0E0E0` | 테두리 |

### 폰트
- 한글: Pretendard
- 영문/숫자: Inter
- 설정: `layout.tsx` 참조

### 반응형
- Mobile First (기본)
- Desktop Admin: 1440px 기준
- Max Width: 480px (모바일 콘텐츠)

---

## 🐛 알려진 이슈

1. **CSS @import 경고**: Tailwind 4.0 특성, 무시 가능
2. **Supabase 미연동**: 현재 Mock 데이터 사용 중
3. **PUSH 미구현**: FCM 연동 필요

---

## 📞 문의

- PRD 문서: `PRD/integrated_PRD.md`
- 프로토타입: `input_prototypes/` 폴더

---

## 📜 라이선스

Private - Dongguk University Scholarship Platform
