# Scala Development Notes

> **프로젝트**: Scala - 동국대학교 맞춤 장학금 알림 PWA  
> **개발 기간**: 2026년 1월  
> **역할**: 풀스택 개발  
> **기술 스택**: Next.js 16, TypeScript, Supabase, Firebase Cloud Messaging, Tailwind CSS, Vercel

---

## 프로젝트 개요

동국대학교 재학생을 위한 **맞춤형 장학금 알림 서비스**. 사용자의 학과, 학년, 학점, 소득분위 등의 조건을 기반으로 신청 가능한 장학금만 필터링하여 제공하고, 신규 장학금 등록 시 실시간 PUSH 알림을 발송합니다.

### 핵심 성과
- Figma 프로토타입 → 실제 서비스 1주일 내 구현
- iOS/Android PWA 푸시 알림 구현 (iOS 16.4+ Standalone 모드 대응)
- Lazy Registration 패턴으로 가입 전환율 최적화

---

## 개발 프로세스

### 디자인 → 코드 변환
Figma로 설계한 UI를 Figma Make를 통해 React 컴포넌트로 변환 후, 실제 비즈니스 로직과 데이터 연동을 구현했습니다.

| 프로토타입 | 구현 내용 |
|-----------|----------|
| Feature 0 | 랜딩 페이지 - Intersection Observer 기반 스크롤 애니메이션, 실시간 가입자 카운터 |
| Feature 001~002 | 온보딩 플로우(스텝별 데이터 입력), 개인화 홈 피드 |
| Feature 3 | 장학금 상세 페이지, 스크랩(찜) 기능 |

---

## 핵심 기술 구현

### 1. PWA (Progressive Web App)

**구현 사항:**
- `next-pwa`를 활용한 Service Worker 자동 생성 및 캐싱 전략 설정
- Web App Manifest 구성: 앱 아이콘, 테마 컬러, display mode 정의
- iOS Safari 전용 PWA 설치 가이드 모달 구현 (Standalone 모드 진입 유도)

**주요 코드:**
```typescript
// next.config.ts
import withPWA from 'next-pwa';

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})({ /* Next.js config */ });
```

---

### 2. Lazy Registration 패턴

회원가입 없이 서비스 핵심 기능(장학금 조회)을 먼저 체험하게 하여 진입 장벽을 낮추는 UX 패턴을 구현했습니다.

**데이터 플로우:**
1. 사용자 입력 데이터 → `localStorage`에 임시 저장 (`temp_user_data`)
2. API 호출 시 임시 데이터를 Body로 전송 → 서버에서 쿼리 전용 처리 (DB 저장 X)
3. 회원가입 완료 시 → `POST /api/users/profile` 호출하여 DB에 정식 저장
4. 성공 후 `localStorage` 임시 데이터 삭제

**구현 코드:**
```typescript
// 회원가입 후 데이터 이관 로직
const migrateUserData = async (userId: string) => {
  const tempData = localStorage.getItem('temp_user_data');
  if (!tempData) return;

  await supabase.from('user_profiles').upsert({
    user_id: userId,
    ...JSON.parse(tempData)
  });

  localStorage.removeItem('temp_user_data');
};
```

---

### 3. Supabase 백엔드 구축

**데이터베이스 설계:**
- 7개 테이블: `users`, `user_profiles`, `scholarships`, `scraps`, `push_logs`, `admin_settings`, `departments`
- Foreign Key 관계 설정 및 CASCADE 삭제 정책 적용

**Row Level Security (RLS) 정책 구현:**
```sql
-- 사용자는 본인의 스크랩만 조회/수정 가능
ALTER TABLE scraps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scraps"
  ON scraps FOR ALL
  USING (auth.uid() = user_id);
```

**인증 구현:**
- Supabase Auth를 활용한 카카오/구글 OAuth 2.0 소셜 로그인
- `auth.callback` Route Handler에서 토큰 교환 및 세션 생성 처리

---

### 4. Firebase Cloud Messaging (FCM) 푸시 알림

**클라이언트 측 (토큰 발급):**
```typescript
// src/lib/firebase.ts
export async function requestFCMToken(): Promise<string> {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permission denied');

  const swRegistration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js',
    { scope: '/' }
  );

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: swRegistration
  });

  return token;
}
```

**서버 측 (알림 발송):**
```typescript
// src/lib/fcm-admin.ts
export async function sendPushNotification(
  tokens: string[],
  title: string,
  body: string
) {
  const message: admin.messaging.MulticastMessage = {
    tokens,
    data: { title, body }, // data-only 메시지로 중복 알림 방지
    webpush: {
      fcmOptions: { link: '/home' }
    }
  };

  return admin.messaging().sendEachForMulticast(message);
}
```

**Service Worker (백그라운드 수신):**
```javascript
// public/firebase-messaging-sw.js
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: '/icon-192.png'
  });
});
```

---

### 5. 장학금 매칭 알고리즘

사용자 프로필 조건과 장학금 지원 자격을 비교하여 신청 가능한 장학금만 필터링하는 로직을 구현했습니다.

**필터링 조건:**
- 학과: `target_departments` 배열에 포함 여부 (또는 NULL = 전체)
- 학년: `target_grade` 배열에 포함 여부
- 학점: 사용자 학점 ≥ `min_gpa`
- 소득분위: 사용자 소득분위 ≤ `max_income_bracket`
- 특수조건: 장애인, 다자녀, 국가유공자 여부

**쿼리 빌더 패턴:**
```typescript
// src/app/api/scholarships/match/route.ts
let query = supabase.from('scholarships').select('*');

if (userProfile.grade) {
  query = query.contains('target_grade', [userProfile.grade]);
}
if (userProfile.prev_semester_gpa) {
  query = query.or(`min_gpa.is.null,min_gpa.lte.${userProfile.prev_semester_gpa}`);
}
if (userProfile.income_bracket) {
  query = query.or(`max_income_bracket.is.null,max_income_bracket.gte.${userProfile.income_bracket}`);
}
```

---

### 6. 관리자 시스템

**대시보드:**
- 일별 가입자 추이 차트 (Recharts 라이브러리 활용)
- 실시간 통계: MAU, 푸시 CTR, Empty State 비율

**장학금 CRUD:**
- 등록/수정 폼: 타겟 조건(학과, 학년, 학점, 소득분위) 설정 UI
- 마감 처리: `is_closed` 플래그 토글

**타겟 푸시 발송:**
- 조건별 대상 유저 필터링 (학과, 학년, 학점, 소득분위, 특수조건)
- 발송 전 대상 수 실시간 미리보기 API 구현
- `push_logs` 테이블에 발송 이력 저장

---

## 트러블슈팅

### 1. iOS PWA 푸시 토큰 발급 실패

**문제**: 알림 권한 허용 후에도 FCM 토큰 발급이 실패하며 "API key not valid" 에러 발생

**원인**: Vercel 환경변수의 Firebase API 키에 오타 존재 (소문자 `l`과 숫자 `1` 혼동)

**해결**: Firebase Console에서 API 키 재확인 후 환경변수 수정

**개선**: 에러 메시지를 UI에 상세히 표시하도록 수정하여 디버깅 시간 단축

---

### 2. 푸시 알림 중복 발송

**문제**: 알림 발송 시 동일한 알림이 2개씩 표시

**원인**: 
- FCM의 `notification` 필드 사용 시 → 시스템이 자동으로 알림 표시
- Service Worker의 `onBackgroundMessage`에서도 알림 표시
- 결과적으로 2번 표시

**해결**: 
- `notification` 필드 제거, `data` 필드만 사용하는 Data-only 메시지로 변경
- Service Worker에서만 알림 표시하도록 단일화

---

### 3. 푸시 발송 대상 수 불일치

**문제**: 미리보기에서 1명인데 실제 발송 결과는 0명

**원인**: Supabase 쿼리 빌더는 실행 후 재사용 불가. 첫 번째 count 쿼리 실행 후 동일 객체로 토큰 조회 시도하여 실패

**해결**: FCM 토큰 조회를 위한 쿼리를 별도로 빌드하도록 수정

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 4.0, shadcn/ui |
| Database | Supabase (PostgreSQL 15) |
| Authentication | Supabase Auth (OAuth 2.0) |
| Push Notification | Firebase Cloud Messaging |
| PWA | next-pwa 5.6 |
| Deployment | Vercel |
| Charts | Recharts |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/          # 인증 관련 라우트
│   ├── admin/           # 관리자 페이지
│   ├── api/             # API Route Handlers
│   ├── home/            # 홈 피드
│   ├── onboarding/      # 온보딩 플로우
│   └── scholarship/     # 장학금 상세
├── components/
│   ├── common/          # 공통 컴포넌트
│   ├── landing/         # 랜딩 페이지 컴포넌트
│   └── scholarship/     # 장학금 관련 컴포넌트
├── lib/
│   ├── firebase.ts      # FCM 클라이언트 설정
│   ├── fcm-admin.ts     # FCM 서버 설정
│   └── supabase/        # Supabase 클라이언트
└── types/               # TypeScript 타입 정의
```

---

*Last Updated: 2026-01-13*
