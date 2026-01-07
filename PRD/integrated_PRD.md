# 서비스 PRD for Antigravity

# 1. Product Overview

**1-1. 제품 비전**

- 동국대학교 재학생/휴학생이 자신이 받을 수 있는 장학금만 PUSH 알림으로 받아 장학금을 놓치지 않고 매번 들여다보는 기회비용을 없앤다.

**1-2. 타겟 사용자**

- 장학금으로 생활비를 충당하고 싶은 동국대학교 재학생 및 휴학생 (20세~24세가 가장 많음). 장학 공지를 종종 찾아보지만 매번 찾아보는 행위에 부담감과 귀찮음을 느낌.

**1-3. 핵심 목표**

- 동국대학교 장학공지에 올라오는 등록금성/생활비성/혼합지원 장학금을 모두 PUSH 알림화
- 출시 1개월 내 MAU 100명 달성
- 총학생회 제휴 1개월 내 MAU 1,000명 달성

---

# 2. User Personas & Stories

**2-1. 사용자 페르소나**

- 하동훈 (소득분위 1분위)
    - 재학, 2학년, 인문계열 소형과
    - 목표: 노력이 덜 필요한 생활비성 장학을 매 학기 받고 싶음
    - 페인포인트: 받을 수 있는 장학은 많지만 장학공지를 자주 확인하기 귀찮음
- 고윤정 (소득분위 8분위)
    - 휴학, 3학년, 이공계열 대형과
    - 목표: 자신도 지원할 수 있는 장학 공지가 올라올 때마다 등록금성이든 장학금성이든 모두 넣고싶음
    - 페인포인트: 장학공지를 자주 확인해도 자신이 지원할 수 있는 장학금이 많지 않아서 의지가 꺾임

**2-2. 사용자 스토리**

- 하동훈
    - 재학생으로서, 학업에 집중하기 위해, 노력이 많이 필요하지 않은 장학을 받고 싶다.
    - 1분위로서, 용돈을 위해, 생활비성 장학을 받고 싶다.
- 고윤정
    - 휴학생으로서, 복학 준비를 위해, 복학예정자도 받을 수 있는 장학을 받고 싶다.
    - 이공계로서, 이공계가 받을 확률이 높은 장학을 받고 싶다.
    - 8분위로서, 부모님을 위해, 등록금이든 장학금이든 지원할 수 있는 아무 장학이나 받고 싶다.

---

# 3. Success Metrics

## **3-1. KPIs**

- **MAU**: 출시 1개월 내 100명, 총학생회 제휴 1개월 내 1,000명 달성
- **Lazy Registration → Signup Conversion Rate**: 데이터 입력 완료 대비 회원가입 완료 비율 **30% 이상**
- **PUSH 알림 오픈율 (CTR)**: 발송 대비 클릭 비율 평균 **80% 이상**
- **PWA 설치율**: iOS 가입자 중 홈 화면 추가 유저 비율 **80% 이상**

## **3-2. Analytics Plan**

- **lazy_registration_started**: 데이터 입력 폼 시작
- **lazy_registration_completed**: 데이터 입력 완료 ("내 장학금 보기" 클릭)
- **sticky_bar_clicked**: Sticky Bar "가입하기" 버튼 클릭
- **signup_completed**: 회원가입 완료
- **push_notification_opened**: PUSH 알림 클릭
- **scholarship_detail_viewed**: 상세 페이지 진입
- **outbound_link_clicked**: "장학금 받으러 가기" 클릭
- **scholarship_scrapped**: 찜하기 버튼 클릭
- **empty_result_viewed**: 빈 화면 노출

---

# 4. Out of Scope (이번 버전에서 제외)

- 장학 공고 리스트 필터 선택 기능(등록금순으로 보기, 생활비성 장학만 보기 등)
- 자동 크롤링 (수동 입력으로 대체)
- 다국어 지원
- 타 대학 확장

---

# 5. Risks & Mitigation

- **Risk 1**: iOS PWA 설치율 저조 → **Mitigation**: Sticky Bar + 설치 유도 모달
- **Risk 2**: 비회원 이탈 → **Mitigation**: Lazy Registration으로 진입 장벽 최소화
- **Risk 3**: 장학금 0개 유저 이탈 → **Mitigation**: Empty State에서 위로 문구 + PWA 설치 유도

---

# 1. Feature 0: 랜딩 페이지 (Landing Page)

**Description**: 서비스의 핵심 가치를 전달하고, Opal 앱의 인터랙티브한 애니메이션처럼 사용자의 회원가입(CTA)을 유도하는 첫 화면입니다.

**Design Concept**:

- **Main Theme**: Clean White Background (순수 흰색 배경)
- **Point Color**: Dongguk Orange (#FF6B35) - 숫자, CTA 버튼에만 사용
- **Tone**: 신뢰감 있고 깔끔한 고해상도 화이트 톤

# 2. 상세 내용 (Details)

**Hero Section (진입 화면) - Interactive Animation**

- **배경**: 순수 흰색(#FFFFFF)
- **인터랙션**: 스크롤 시 화면이 내려가지 않고, 텍스트가 **제자리에서 Fade-in/Fade-out** 되며 순차적으로 전환
- **Copy Flow (Opal 스타일 Sequential Animation)**:
    1. **1단계**: (2025년에 놓친 동국대학교 장학공고) - 스크롤 내릴 시 Fade-out
    2. **2단계**: "361개" (숫자 부분 **오렌지색(#FF6B35)** 강조) - 스크롤 내릴 시 Fade-out(위로 올렸을 때는 다시 전단계로 Fade-In)
    3. **3단계**: "PUSH 알림만 켜두세요. 이번 학기는 무조건 받게 해드릴게요." (총액 오렌지색 강조) - 여기부터 스크롤 가능 상태로 전환(위로 올렸을 때는 다시 전단계로 Fade-In)

**Benefits & CTA Section (스크롤 후 노출)**

- **Copy**: "어? 나도 해당되네? 의외의 용돈, 알림으로 확인하세요.”
- **Visual**: 화이트 톤의 깔끔한 PWA 앱 목업(Mockup) 이미지 (PUSH 알림 온 알림센터 화면)
- **3가지 핵심 베네핏** (아이콘 + 텍스트):
    - "지원 가능한 공고만"
    - "장학 공고가 등록될 때마다"
    - "이번 학기 장학금 받을 때까지"
- **CTA Button**: 오렌지색(#FF6B35) 솔리드 버튼, 흰색 텍스트, 48px 높이
**"내 맞춤 장학금 조회하기"**

**Social Proof (실시간 신청 현황)**

- Position: 메인 CTA 버튼 바로 위
- Copy: "현재 {N}명이 PUSH 알림 신청"
- Visual Element:
* 텍스트 좌측에 6~8px 크기의 초록색(#2ECC71) 원형 점 배치
* 점 주변으로 투명도가 조절된 초록색 원이 커졌다 작아지는 Pulse Animation (1.5초 간격 루프) 적용
- Design:
* 텍스트 전체를 감싸는 캡슐(Pill) 형태의 배경 (연한 오렌지색 Opacity 10%)
* "{N}명" 부분은 Dongguk Orange(#FF6B35) 및 볼드(Bold) 처리
    - Logic (Counter Algorithm):
        - Base Value (Default): 13 (초기값)
        - Display Value: 13 + n (n = 실제 '회원가입/알림받기' 완료 유저 수)
        - Trigger: 실제 **회원가입(알림 신청) 유저**가 늘어날 때마다 +1 증가

**Live Benefit Ticker (실시간 혜택 알림)**

- Position: Social Proof 텍스트 하단 10px 위치 (자동으로 상단으로 롤링되며 교체)
- Visual Style:
    - 배경: 반투명 블랙(#000000, Opacity 60%) + 둥근 모서리(Radius 16px)
    - 텍스트: 화이트(#FFFFFF), 금액 부분만 포인트 컬러(#FFD700 or Brand Orange)
- Animation:
    - 아래에서 위로 부드럽게 슬라이드 업(Slide-up) 되며 등장 (0.5초)
    - 3초 대기 후 위로 사라지거나(Fade-out), 다음 텍스트로 교체
    - 무한 롤링(Infinite Loop)
- Data Logic (Random Generator):
    - [이름]: 한국 성씨(김, 이, 박, 최, 정 등) 랜덤 + "** 학우" 조합 (예: 김** 학우, 박** 학우)
    - [문구]: "{이름} 조회 결과 지원 가능 장학금 {금액}"
    - [금액 확률 분포(Weighted Random)]:
        - 100만+ (확률 60%)
        - 200만+ (확률 30%)
        - 300만+ (확률 10%)

**Global Sticky Signup Bar (하단 고정 가입 유도 바)**

- **Definition:** 스크롤 위치와 관계없이 항상 화면 하단에 노출되는 즉시 가입 유도 영역
- **Position:** Viewport Bottom (z-index: 최상위), 기존 CTA 버튼들과 겹치지 않도록 하단 여백 확보
- **Visual Style:**
    - 형태: 화면 좌우 여백이 있는 Floating 형태의 둥근 바 (Radius 16px 이상)
    - Color: Brand Orange (#FF6B35) 배경 + White (#FFFFFF) 텍스트
    - Components:
        - Text: "회원가입 하고 PUSH 알림 받기" (Left Align)
        - Button: White 배경 + Orange 텍스트 "가입하기" (Right Align, Small size)
- **Interaction Logic (Direct Signup Flow):**
    - **Trigger:** '가입하기' 버튼 클릭 시
    - **Action:**
        1. 온보딩(장학금 조회) 프로세스를 건너뛰고, 즉시 **[회원가입/로그인 페이지]**로 이동한다.
        2. Supabase Auth와 직접 연동하여 정식 회원가입 절차를 시작한다.
    - **Distinction:** 메인 화면의 "내 맞춤 장학금 조회하기" 버튼(Lazy Registration)과 달리, 데이터를 입력받지 않고 바로 계정 생성 단계로 진입한다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- **[애니메이션 검증]** 페이지 진입 후 스크롤 시 텍스트가 순차적으로 Fade-in/out 되며, 3단계 도달 후 스크롤이 활성화되어야 한다.
- **[화면 이동]** "내 맞춤 장학금 조회하기" 버튼 클릭 시, 지연 없이 **데이터 입력 화면(Feature 1)**으로 전환되어야 한다.
- **[반응형]** 모바일 웹(PWA) 환경에서 텍스트가 줄바꿈 등으로 깨지지 않고 가독성 있게 정렬되어야 한다.
- **[성능]** 애니메이션이 60fps로 부드럽게 작동해야 하며, 저사양 기기에서도 끊김 없이 재생되어야 한다.
- **[카운팅 로직]** 신청자 수 표기는 '0'이 아닌 '13'부터 시작되어야 하며, 실제 **회원가입(알림 신청) 유저**가 늘어날 때마다 `13 + 실제 가입자 수`로 합산되어 표시되어야 한다.
- **[데이터 연동]** 새로고침 시 초기화되지 않고, 누적된 숫자가 유지되어야 한다. (DB 연동 필요)
- **[UI/UX]** '실시간 조회 중' 문구 앞의 초록색 점은 정지된 이미지가 아니라, CSS Keyframes 등을 활용하여 **심장 박동처럼 깜빡이거나(Pulse) 빛나는 애니메이션**이 적용되어야 한다.
- **[알림 로직]** 실시간 혜택 알림은 고정된 텍스트가 아니며, 기획서에 명시된 확률(6:3:1)에 따라 금액과 성씨가 랜덤하게 조합되어 3초 간격으로 롤링 되어야 한다.

---

# 1. Feature 1: 데이터 입력 및 Lazy Registration (Data Collection without Sign-up)

**Description**: 회원가입 없이 사용자가 장학금 조회에 필요한 데이터(users 테이블과 동일하지만 회원가입만 하지 않은 상태)를 입력하고, **즉시 맞춤 장학금 리스트를 확인**할 수 있는 핵심 온보딩 프로세스입니다. 전환율(Conversion Rate)을 높이기 위해 가입 장벽을 최소화한 **Lazy Registration 전략**을 적용합니다.

# 2. Process Flow

1. 랜딩 페이지 CTA 클릭
2. **데이터 입력 폼** (회원가입 X)
    - 학과, 학년, 직전 학기 평점(GPA), 소득분위, 거주지 입력
    - 스텝별 UI: 한 화면에 1~3개 질문만 배치 (Opal 스타일 Single Question per Screen)
3. 입력 완료 후 **"내 장학금 보기"** 버튼 클릭
4. 로딩 화면 → 진척되고 있는 느낌의 애니메이션 활용
5. **개인화된 장학금 홈 피드(Feature 2)** 진입

# 3. Tech Spec (Persistence & Query-only Mode)

## 3-1. Client-side Temporary Storage

- 입력된 데이터는 서버 DB에 저장되지 않고, Browser `localStorage`에 임시 저장
- Key: `temp_user_data`
- **Value JSON Schema (users 테이블 구조와 완전 일치):**

```json
{
	"department_id": "UUID string",
	"department_name": "string (NOT NULL)",
	"college": "string (NOT NULL)",
	"grade": "number (1-4)",
	"avg_gpa": "number (0-4.5)",
	"prev_semester_gpa": "number (0-4.5)",
	"income_bracket": "number (0-11, default: 11)",
	"hometown_region": "string | null",
	"enrollment_status": "string ('enrolled' | 'on_leave')",
	"has_disability": "boolean (default: false)",
	"is_multi_child_family": "boolean (default: false)",
	"is_national_merit": "boolean (default: false)"
}
```

- **⚠️ Critical**: `department_id` 선택 시, 클라이언트는 반드시 `departments` 테이블을 조회하여 해당 학과의 `name`과 `college` 값을 함께 저장해야 함 (DB INSERT 시 NOT NULL 제약 충족을 위해)

## 3-2. Server Query (Non-persistent)

- 클라이언트는 `localStorage` 데이터를 서버로 전송하되, **POST `/api/scholarships/query`** 엔드포인트 호출 (SAVE 아님)
- 서버는 DB에 저장하지 않고, 입력 조건에 맞는 장학금 리스트만 **계산하여 리턴**
- Response: `{ matched_scholarships: [], count: number }`

## 3-3. Data Migration (회원가입 시)

- 회원가입 성공(Token 발급) 후, `localStorage`의 `temp_user_data` 확인
- 데이터 존재 시 **POST `/api/user/preferences`** 호출하여 DB에 정식 저장
- 성공 후 `localStorage.removeItem('temp_user_data')` 실행

# 4. 상세 내용 (Details)

- **Progress Indicator**: 상단에 진행 바(Step 1/5 형태), 오렌지색 Fill
- **버튼**: "다음" 버튼 - 오렌지색 솔리드, "이전" 버튼 - 회색 아웃라인

# 5. Priority

**Must-have**

# 6. Acceptance Criteria

- **[로컬 저장 검증]** 데이터 입력 후 브라우저를 새로고침해도 `localStorage`에 데이터가 남아있어야 한다.
- **[쿼리 전용 검증]** 서버 `users` 테이블에 데이터가 저장되지 않아야 하며, 장학금 리스트만 정확히 리턴되어야 한다.
- **[즉시 조회]** "내 장학금 보기" 버튼 클릭 후 1.5초 이내에 홈 피드 화면이 로드되어야 한다. → 1.5초 이내 동안은 진척되는 듯한 애니메이션 활용
- **[이관 검증]** 회원가입 완료 시 `localStorage` 데이터가 DB로 이관되고, 로컬 데이터는 삭제되어야 한다.

---

# 1. Feature 2-1: 맞춤형 신규 장학 공고 PUSH 알림창

유저가 입력한 데이터를 기반으로, 신청할 수 있는 장학 공고가 업데이트 되었을 때 사용자에게 PUSH 알림을 보내는 기능.

# 2. Details

- DB의 유저 정보와 매칭되는 장학금만 알림을 보낸다.
- '지원할 수 있는 장학금이 올라왔어요!'라는 문구 아래에 장학금명, 카테고리(생활비성인지, 등록금성인지, 둘 다 지원해주는 혼합 지원인지), 지원 금액, D-Day를 표시한다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- 정확히 전달이 되어야 한다. 예를 들어 소득분위 8구간 유저에게는 9, 10구간 대상 장학금이 PUSH 알림이 가지 않도록 해야 한다.

---

# 1. Feature 2: 개인화된 장학금 홈 피드 (Personalized Home)

**Description**: 유저가 입력한 데이터(필터)에 기반하여 신청 가능한 장학금만 큐레이션해서 보여주며, **회원가입 전환을 유도하는 Sticky Bar**를 통해 이탈을 방지하는 핵심 화면입니다.

# 2. Details

- **GNB (Global Navigation Bar)**
    - **우측**: **[프로필 아이콘]** 배치 - **조건부 렌더링 적용**
        - **IF 비회원 (`localStorage.getItem('auth_token') === null`)**:
            - 프로필 아이콘, 클릭 시 Popover 노출되는 것은 동일
            - 찜 목록/계정 관리/로그아웃 버튼이 없고, 회원가입하기/로그인하기 버튼이 있음.
            - 회원가입 버튼을 누를 시 회원가입 페이지로
            - 로그인 버튼을 누를 시 로그인 페이지로 이동
        - **IF 회원 (`localStorage.getItem('auth_token')` 존재)**:
            - **프로필 아이콘 표시** (동그라미 아이콘, 24px, 터치 영역 44px × 44px)
            - **Action**: 클릭 시 **Google 계정 메뉴 스타일 Popover(모달)** 노출
            - **Popover Position**: 우측 상단 정렬, 하단 방향 드롭다운
            - **Menu Items**:
                1. **[찜 목록]** - 클릭 시 찜한 장학금 리스트 페이지(`/scraps`)로 이동
                    - **UI 컴포넌트**: 홈 피드 장학금 카드 컴포넌트(`ScholarshipCard.tsx`) 재사용
                    - **정렬 로직 (Feature 5와 동일)**:
                        1. 마감되지 않은 공고(`is_closed = false AND deadline >= TODAY()`) - D-Day 오름차순
                    - **빈 상태(Empty State)**: 찜한 장학금이 0개일 경우, "아직 찜한 장학금이 없어요" 문구 + "찜하러 가기" CTA 버튼 표시
                        - 찜하러 가기 버튼 클릭 시 장학금 홈 피드로 이동
                2. **[계정 관리]** - 클릭 시 내 정보 수정 페이지로 이동
                3. **[로그아웃]** - 클릭 시 `localStorage` Token 삭제 후 랜딩 페이지로 리다이렉트
- **장학금 리스트 (Card Grid)**
    - D-Day 순으로 정렬 (마감 임박한 공고가 가장 위)
    - DB의 유저 정보와 매칭되는 장학금만 카드형 UI 형태로 노출
    - 비회원: 클라이언트가 POST /api/scholarships/query 호출 시 localStorage.temp_user_data를 Body로 전송하고, 서버는 이 JSON 데이터를 기준으로 매칭된 장학금 리스트를 리턴 (DB 저장 없이 쿼리만 실행)
    - 각 카드: 장학금명(Bold), 카테고리 뱃지(생활비성/등록금성/혼합지원), 지원 금액(큰 텍스트, 오렌지색), D-Day(우측 상단, 오렌지색 강조)
- **Conversion Trigger: Sticky Bar (전환 유도)**
    - **표시 조건**
        1. 비회원 상태(`localStorage.getItem('auth_token') === null`) 시 항상
    - **Sticky Bar 숨김 조건:**
        - 회원가입 완료 시 → 영구 숨김
    - **⚠️ 개발 시 주의사항:**
        - Sticky Bar는 **Bottom Fixed Position** (`position: fixed; bottom: 0`)
        - 화면 하단 Safe Area 침범 방지: `padding-bottom: env(safe-area-inset-bottom)`
        - iOS Safari에서 주소창이 사라질 때 화면 높이 변화 대응: `height: 100dvh` 사용
    - **위치**: 화면 하단 고정 (Bottom Sticky)
    - **디자인**:
        - 배경: 오렌지색 그라데이션 (Linear Gradient: #FF6B35 → #FF8C5A)
        - 높이: 64px
        - 텍스트: 흰색, 16px SemiBold
        - Copy: **"정보가 임시 저장 중이에요!(크게) (줄띄우고)카카오로 3초 만에 가입하고 장학 공고가 올라올 때마다 알림 받기(조금 작게)"**
        - CTA: "가입하기" 버튼 (흰색 배경, 오렌지 텍스트, 작은 버튼)
    - **Action**: 클릭 시 회원가입 화면으로 이동
- **[Empty State 위로 문구]** 조건에 맞는 장학금이 0개일 경우:
    - **(아이콘/일러스트)**: 돋보기나 망원경을 든 캐릭터 (탐색 중인 느낌)
    - **Headline:** **"조건에 딱 맞는 공고가 아직 없어요."**
    - **Subtext:** **"하지만 내일 당장 올라올 수도 있어요.
    스칼라가 매일 지켜보다가 뜨면 바로 알려드릴까요?"**
    - **CTA Button:** **[ 3초 만에 알림 예약하기 ]** *(버튼 하단에 작게: 카카오로 간편하게 시작)*

# 3. Priority

- **Must-have**

# 4. Acceptance Criteria

- **[필터링 정확도]** 소득분위 9구간 유저에게는 8구간 이하 대상 장학금이 노출되지 않아야 한다.
- **[Sticky Bar 표시]** 비회원 상태 시, Sticky Bar가 즉시 하단에 고정 표시되어야 한다.
- **[Popover 동작]** 프로필 아이콘 클릭 시, Popover가 우측 상단 정렬로 부드럽게 나타나야 한다.
- **[Empty State]** 장학금 0개일 때 위로 문구 및 Sticky Bar가 즉시 하단에 고정 표시되어야 한다.

---

# 1. Feature 3: 장학금 상세 조회 및 스크랩 (Detail & Scrap)

장학금의 세부 모집 요강을 확인하고, 관심 있는 공고를 저장(찜)하거나 실제 신청 페이지로 이동하는 기능입니다.

# 2. Details

- 상세 페이지 진입 시 장학 이름, 카테고리(생활비성인지, 등록금성인지, 둘 다 지원해주는 혼합 지원인지), 지원 금액, D-Day를 화면 상단에 표시하고, 아래 상세 내용에는 모집 대상, 제출 서류, 중복 수혜 여부 등 전체 정보를 보여준다.
- 화면 하단 혹은 상단에 '하트(찜하기)' 버튼을 배치하여 `scraps` 테이블에 저장/삭제한다.
- '장학금 받으러 가기' 버튼 클릭 시, `scholarship_clicks` 테이블에 클릭 로그를 저장한 후, 해당 장학금의 원본 공지사항 URL이 새 창으로 열린다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- 하트 버튼을 누르면 즉시 UI가 변경되고(채워진 하트), 재접속 시에도 상태가 유지된다.
- 외부 링크 이동 시 앱 내 브라우저가 아닌 시스템 브라우저(또는 새 탭)로 연결된다.

---

# 1. Feature 4: 회원가입 및 데이터 이관

비회원 상태에서 입력한 임시 데이터를 정식 유저 계정으로 이관하고, OS별로 최적화된 알림 권한 요청 플로우를 제공하는 기능입니다.

# 2. Process Flow

1. Sticky Bar 또는 랜딩페이지의 "가입하기" 버튼 클릭
2. 소셜 로그인 선택 (카카오/구글/이메일)
3. 로그인 성공 → Token 발급
4. **자동 데이터 이관** (백그라운드 처리)
5. **OS별 분기 처리** (Android / iOS)

# 3. Tech Spec (Auth & Data Merge)

- **Authentication**:
    - Supabase Auth 사용 (카카오/구글 OAuth 2.0, 이메일 인증)
    - 로그인 성공 시 Access Token 발급 → `localStorage.setItem('auth_token', token)` 저장
- **Data Migration Logic**:
    1. 로그인 성공(Token 발급) 즉시, 클라이언트는 `localStorage.getItem('temp_user_data')` 확인
    2. 임시 데이터 존재 시, **POST `/api/user/preferences`** 호출
        - Headers: `Authorization: Bearer {token}`
        - Body: `localStorage`의 임시 데이터 JSON
    3. 서버는 `users` 테이블에 유저 정보 INSERT/UPDATE
    4. 성공 응답 시, 클라이언트는 `localStorage.removeItem('temp_user_data')` 실행
    5. 실패 시, 에러 로그 전송 (Sentry) 및 **자동 재시도 로직 실행(최대한 실패하지 않도록 하는게 목표)**:
        - **재시도 횟수**: 최대 3회, 각 재시도 간격 2초 (Exponential Backoff 미적용)
        - **3회 실패 후 처리 (⚠️ 데이터 보존 우선):**
            - `localStorage.temp_user_data` **유지** (삭제하지 않음)
            - `localStorage.setItem('migration_failed', 'true')` 플래그 저장
            - 유저에게 **전체 화면 모달** 표시 (닫기 불가):
                - **제목**: "거의 다 끝났어요!"
                - **본문**: "네트워크 문제로 데이터 저장에 실패했습니다.
                입력하신 정보는 안전하게 보관 중이니 걱정마세요."
                - **CTA**: "다시 시도" (오렌지색) → 클릭 시 **Data Migration Logic 1번부터 재실행**
            - 모달 닫기 불가 (사용자가 데이터 저장을 완료할 때까지 재시도 유도)
        - **Background Retry (백그라운드 재시도):**
            - 모달 표시 중에도 **10초마다 자동 재시도** (최대 10회, 총 100초)
            - 성공 시 모달 자동 닫기 + 홈 피드로 이동
            - 10회 실패 시:
                - **Fallback Plan**: 서버에 **임시 데이터 저장 API** 호출 (`POST /api/temp-user-data`)
                    - Body: `{ temp_data: localStorage.temp_user_data, auth_token: token }`
                    - 서버는 `temp_user_sessions` 테이블에 임시 저장 (TTL 24시간)
                - 사용자에게 안내: "일시적으로 데이터를 임시 저장했습니다. 내일까지 다시 접속해주세요!"
        - **⚠️ 개발 시 주의사항:**
            - **절대 `localStorage.temp_user_data` 삭제 금지** (데이터 손실 = 사용자 이탈)
            - Sentry에 에러 전송 시 **사용자 ID + 재시도 횟수 + 에러 메시지** 포함
- **[Global Routing Rule]**
    - **메인 URL(`/`) 접속 시 우선순위 기반 라우팅**:
        1. **Token 보유 유저 (회원)**: `localStorage.getItem('auth_token')` 존재 시
            - → 홈 피드(`/home`) 즉시 리다이렉트 (302 Redirect)
        2. **Token 없음 + 임시 데이터 보유 유저 (비회원 재방문)**: `localStorage.getItem('temp_user_data')` 존재 시
            - → 홈 피드(`/home`) 즉시 리다이렉트 (Query-only 모드로 장학금 조회)
            - ⚠️ 이때 홈 피드 진입 시 Sticky Bar “**정보가 임시 저장 중이에요!(크게) (줄띄우고)카카오로 3초 만에 가입하고 장학 공고가 올라올 때마다 알림 받기(조금 작게)"** 자동 표시
        3. **Token 없음 + 임시 데이터 없음 (신규 방문자)**:
            - → 랜딩 페이지(`/landing`) 표시
    - **⚠️ 개발 시 주의사항**:
        - Next.js Middleware(`middleware.ts`)에서 위 로직 구현 권장
        - **`temp_user_data`** 존재 여부는 서버에서 확인 불가하므로, 클라이언트 측 useEffect Hook으로 초기 라우팅 처리
- **[Post-Signup Flow by OS]**
    - **Case 1: Android 유저**
        1. 가입 완료 즉시 **회원가입 성공 페이지** 표시
            - Copy: "환영합니다! 이제 맞춤 장학금 알림을 받을 수 있어요."
        2. **시스템 알림 권한 요청 팝업** 자동 실행
            - `Notification.requestPermission()` 호출
            - System Popup: "ooo에서 알림을 보내도록 허용하시겠습니까?" → [허용]
    - **Case 2: iOS 유저**
        1. **Step 1 (Web Browser Mode)**: 가입 완료 후 **전체 화면 모달(닫기 불가)** 표시
            - **제목**: "아이폰을 사용 중이시네요. Apple 정책상 홈 화면에 추가해야만 알림을 드릴 수 있어요!"
            - **설치 가이드** (화살표 애니메이션 포함):
                - STEP 1: 오른쪽 하단 ··· 클릭
                - STEP 2: 하단 **공유 버튼** 클릭
                - STEP 3: 오른쪽 하단 더 보기(···) 클릭
                - STEP 4: "홈 화면에 추가" 선택
                - STEP 5 (강조): **"사파리를 닫고, 바탕화면에 생긴 앱을 실행해주세요!"**
                - STEP 6: 앱 실행 후 알림 권한 허용
            - **CTA**: "홈 화면에 추가했어요" 버튼 (회색 아웃라인) - 클릭 시 모달 닫기
        2. **Step 2 (Standalone App Mode)**: 유저가 홈 화면 아이콘으로 앱 실행 시
            - **Detect Standalone Mode**: `window.matchMedia('(display-mode: standalone)').matches === true`
            - **Logic**:
                1. Standalone 모드 감지
                2. **알림 권한 상태 체크**: `Notification.permission` 확인
                    - IF `"default"` (아직 요청 안 함): Step 2-1 실행
                    - IF `"granted"` (이미 허용): 아무 동작 안 함, 홈 피드 정상 표시
                    - IF `"denied"` (거부됨): 홈 피드 상단에 "알림을 켜야 새 장학금을 받을 수 있어요" Info Banner 표시 (설정 앱 이동 링크 포함)
            - **Action (Step 2-1 - 권한 미요청 상태일 때만)**:
                - **전체 화면 모달(닫기 불가)** 표시
                - **제목**: "마지막 단계! 알림 권한을 허용해주세요"
                - **설명**: "새로운 장학금이 올라올 때마다 알려드릴게요"
                - **CTA 버튼**: "알림 받기" (오렌지색) → 클릭 시 `Notification.requestPermission()` 호출
                - System Popup: "ooo에서 알림을 보내고자 합니다" → [허용]
                - **권한 허용 후**: 모달 닫고 홈 피드 표시
                - **권한 거부 후**: 모달 닫고 홈 피드 표시 (상단 Info Banner는 거부 상태 처리 로직에 따라 표시)

# 4. Priority

**Must-have**

# 5. Acceptance Criteria

- **[이관 검증]** 로그인 성공 후 5초 이내에 `users` 테이블에 데이터가 저장되고, `localStorage.temp_user_data`가 삭제되어야 한다.
- **[Routing 검증]** Token 보유 유저가 메인 URL 접속 시, 랜딩 페이지를 거치지 않고 즉시 홈 피드로 이동해야 한다.
- **[Android 알림]** Android 유저는 가입 완료 즉시 알림 권한 요청 팝업이 표시되어야 한다.
- **[iOS 분기]** iOS 유저는 가입 완료 후 설치 가이드 모달이 표시되고, Standalone 모드로 재접속 시 알림 권한 요청이 실행되어야 한다.
- **Data Migration Logic이 실패하지 않는다. 즉, 회원가입 때 정상적으로 기 입력한 데이터를 불러온다.**

---

# 1. Feature 5: 마이페이지 및 정보 수정

유저가 자신의 상황(학기 변경, 소득분위 변동 등)을 업데이트하고, 찜한 장학금을 모아보는 개인화 공간입니다.

# 2. Details

- D-Day 순으로 보여준다(마감 임박한 공고가 가장 위, 이미 마감된 공고는 맨 아래)
- '찜한 장학금' 탭에서 사용자가 스크랩한 공고 리스트를 보여준다.
    - 마감된 공고는 흐리게(Opacity 50%) 처리한다.
    - '찜한 장학금' 탭에서 사용자가 스크랩한 공고 리스트를 보여준다.
        - **마감된 공고 (`is_closed = true` 또는 `deadline < TODAY()` )**:
            - 카드 전체 Opacity 50% 처리
            - D-Day 위치에 "마감" 뱃지 표시 (회색 배경, 흰색 텍스트)
        - **관리자에 의해 삭제된 공고 (`scholarships` 테이블에서 `DELETE`된 경우)**:
            - **DB 쿼리 처리**: `scraps` 테이블과 `scholarships` 테이블을 `LEFT JOIN`하여, [`scholarships.id](http://scholarships.id) IS NULL`인 경우 감지
            - **UI 처리**:
                - 카드는 리스트에 유지 (삭제하지 않음)
                - 카드 전체를 회색 배경(`#F5F5F5`)으로 처리, Opacity 70%
                - 장학금명 위치에 "종료된 공고" 텍스트 표시
                - 상세 페이지 이동 버튼 비활성화 (터치 불가)
                - 하트 아이콘은 유지 (찜 해제 가능 - 클릭 시 리스트에서 삭제)
- '내 정보 수정' 메뉴에서 최초 가입 시 입력했던 데이터를 수정할 수 있어야 한다.
- 수정된 데이터는 즉시 DB에 반영되며, 홈 화면의 추천 리스트도 이에 맞춰 갱신되어야 한다.
- PUSH 알림 수신 동의 여부(ON/OFF)를 설정할 수 있다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- 정보 수정 후 홈 화면으로 돌아갔을 때, 변경된 조건에 맞는 장학금 리스트로 변경되어야 한다.
- 찜한 장학금 리스트에서 찜을 해제하면 목록에서 즉시 사라져야 한다.

---

<Admin 페이지 시작>

# 1. Feature 6: 관리자 대시보드

서비스의 핵심 성장 지표(MAU, CTR)와 리스크(빈 화면 비율)를 한눈에 파악하여 장학금 소싱 방향을 결정하는 메인 화면입니다.

# 2. Details

- **핵심 지표 카드 (Top 4 Metrics):** 화면 최상단에 다음 4가지 지표를 카드 형태로 배치한다.
    1. **Core Growth (MAU):** 이번 달 접속한 활성 사용자 수 (전월 대비 증감 표시).
    2. **All Core Value (PUSH CTR):** 그동안 발송된 PUSH 알림 전체의 평균 클릭률(숫자도 표시).
    3. **Month Core Value (PUSH CTR):** 이번달 발송된 PUSH 알림의 평균 클릭률(숫자도 표시).
    4. **Risk Management (Empty State):** 최근 7일간 홈 화면에 접속했을 때 '신청 가능한 장학금이 0개'였던 유저 접속 비율(숫자도 표시)(%).
- **상세 차트:**
    - 일별/주별 가입자 추이 및 MAU 변화 그래프.
    - 날짜별 PUSH 발송 건수 대비 클릭 수 그래프.
    - **GNB/LNB:** 대시보드에서 장학금 관리, PUSH 관리, 유저 조회 페이지로 이동하는 메뉴 제공.

# 3. Priority

Should-have

# 4. Acceptance Criteria

- 유저가 앱에 접속할 때마다 '마지막 접속일'이 갱신되어 MAU가 정확히 집계되어야 한다.
- '장학금 받으러 가기' 버튼 클릭 시 로그가 저장되어, 대시보드에 실시간(혹은 1시간 단위)으로 합산 수치가 반영되어야 한다.

---

# 1. Feature 7: 장학금 관리

관리자가 장학금 정보를 생성(Create), 수정(Update), 삭제/마감(Delete)하여 앱에 배포하는 기능입니다.

# 2. Details

- 공고 등록 에디터에서 제목, 링크, 기간뿐만 아니라 **필터링 태그(학년, 최소 학점, 소득분위 등)**를 설정할 수 있어야 한다.
- 리스트에서 게시 중인 장학금의 상태를 '마감' 또는 '숨김'으로 변경할 수 있어야 한다.
- DB 스키마에 정의된 `target_grade`, `min_gpa` 등의 필드에 값을 정확히 매핑하여 저장한다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- 관리자가 '등록'을 누르면 즉시 앱의 홈 화면(조건이 맞는 유저)에서 해당 장학금이 보여야 한다.
- 수정 모드에서 기존에 입력된 데이터가 폼에 채워진 상태로 로드되어야 한다.

---

# 1. Feature 8: 타겟 푸시 알림 시스템

특정 조건을 가진 유저 그룹을 추출하여 맞춤형 알림을 발송, 리텐션을 높이는 마케팅 엔진입니다.

# 2. Details

- **자동 매칭 + 수동 조정 방식**: PUSH 알림이 발송되지 않은 장학 공고 리스트가 표시된다. 관리자가 특정 공고를 클릭하면:
    - **좌측 영역**: 장학금 조건 요약 (대상 학과, 학년, 소득분위, GPA 등)
    - **우측 영역**: 백엔드가 자동으로 조건 매칭한 유저 리스트 및 조건 별 일치 여부 (기본적으로 해당하는 조건에 모두 체크박스 선택됨)
- 알림 제목, 본문 내용을 작성하고 '즉시 발송' 또는 '예약 발송(특정 날짜/시간)'을 설정할 수 있다.
- Supabase Edge Functions와 FCM(Firebase Cloud Messaging)을 연동하여 실제 기기로 알림을 전송한다.

# 3. Priority

**Must-have**

# 4. Acceptance Criteria

- 예약된 시간에 알림이 정확히 발송되어야 한다.
- 백엔드가 자동 매칭한 유저 리스트가 정확해야 한다.

---

<디자인 시스템 시작>

# 1. Platform & Screen Size

**Mobile 375px (주 플랫폼), Desktop 1440px (관리자 웹).** 반응형 브레이크포인트: 640px (Mobile), 1024px (Tablet/Desktop).

# 2. Design System - **[NEW: White + Orange Theme]**

## Colors

- **Primary (Dongguk Orange)**: `#FF6B35` (CTA 버튼, 강조 텍스트, D-Day 뱃지, 금액 숫자)
- **Secondary (Light Orange)**: `#FFB4A2` (호버 상태, 보조 강조)
- **Background**: `#FFFFFF` (메인 배경, 카드 배경) - **[NEW: Pure White]**
- **Surface**: `#F8F9FA` (섹션 구분 배경)
- **Border**: `#E0E0E0` (기본 테두리), `#BDBDBD` (구분선)
- **Text Primary**: `#212121` (본문, 제목)
- **Text Secondary**: `#757575` (보조 텍스트, 캡션)
- **Text Disabled**: `#BDBDBD` (비활성 텍스트)
- **Success**: `#4CAF50` (성공 메시지)
- **Error**: `#F44336` (에러 메시지)
- **Info**: `#2196F3` (정보 메시지)

## Typography

- **Font Family**: Pretendard Variable (한글), Inter (영문/숫자)
- **Heading 1**: 28px Bold (모바일), 32px Bold (데스크탑)
- **Heading 2**: 24px SemiBold
- **Heading 3**: 20px SemiBold
- **Body 1**: 16px Regular
- **Body 2**: 14px Regular
- **Caption**: 12px Regular
- **Button**: 16px SemiBold

## Spacing

- **Base Unit**: 4px
- **Section Padding**: 24px (모바일), 64px (데스크탑)
- **Card Padding**: 16px
- **Card Gap**: 12px (모바일), 16px (데스크탑)
- **Button Height**: 48px (모바일), 40px (데스크탑)

## Border Radius

- **Small**: 4px (뱃지)
- **Medium**: 8px (카드, 버튼)
- **Large**: 12px (모달)
- **Round**: 50% (아바타)

## Shadows

- **Card**: `0px 2px 8px rgba(0, 0, 0, 0.08)`
- **Card Hover**: `0px 4px 16px rgba(0, 0, 0, 0.12)`
- **Modal**: `0px 8px 24px rgba(0, 0, 0, 0.16)`
- **Button Active**: `0px 1px 4px rgba(0, 0, 0, 0.16)`

# 3. Visual Style & Tone

**Clean White + Dongguk Orange 테마.** 순수 흰색 배경에 오렌지 포인트 컬러를 사용하여 신뢰감과 활력을 동시에 표현. 라운드 코너 8px, subtle한 그림자 처리. 여백을 넉넉하게 사용하여 정보 밀도를 낮추고 가독성 확보. 톤은 전문적이면서 학생 친화적(formal yet approachable), 동국대 주황색을 CTA 버튼과 핵심 숫자에만 사용.

# 4. Components

## Header

- **높이**: 56px (모바일), 64px (데스크탑)
- **배경**: `#FFFFFF` (Pure White)
- **하단 보더**: `1px solid #E0E0E0`
- **좌측**: 스칼라 로고
    
    ![icon.png](%EC%84%9C%EB%B9%84%EC%8A%A4%20PRD%20for%20Antigravity/icon.png)
    
- **중앙**: 페이지 제목 (Heading 3)
- **우측**: 프로필 아이콘 (24px, 터치 영역 44px × 44px)

## Button (Primary)

- **높이**: 48px (모바일), 40px (데스크탑)
- **배경**: `#FF6B35` (Dongguk Orange)
- **텍스트**: 16px SemiBold, `#FFFFFF`
- **Border Radius**: 8px
- **Box Shadow**: `0px 4px 12px rgba(255, 107, 53, 0.3)`
- **호버**: 배경 `#E55A2A`

## Sticky Bar (Conversion)

- **높이**: 64px
- **배경**: Linear Gradient `#FF6B35` → `#FF8C5A`
- **위치**: 하단 고정 (Bottom Sticky)
- **텍스트**: 흰색, 16px SemiBold
- **CTA**: 흰색 배경, 오렌지 텍스트, 작은 버튼(32px 높이)

## Popover (Profile Menu)

- **배경**: `#FFFFFF`
- **Border**: `1px solid #E0E0E0`
- **Shadow**: `0px 8px 24px rgba(0, 0, 0, 0.16)`
- **Position**: 우측 상단 정렬
- **Menu Item**: 48px 높이, Hover 시 `#F8F9FA` 배경

---

<기술 스펙 시작>

# 1. Tech Stack

- **Frontend**: Next.js 15.1 (App Router), React 19, TypeScript 5.7
- **Styling**: Tailwind CSS 4.0, shadcn/ui (UI 컴포넌트 라이브러리)
- **Backend & Database**: Supabase (PostgreSQL 15, Realtime, Storage)
- **Authentication**: Supabase Auth (소셜 로그인: 카카오, 구글)
- **Push Notifications**: Firebase Cloud Messaging (FCM) + Supabase Edge Functions
- **PWA**: next-pwa 5.6 (Service Worker, Web Manifest 자동 생성)
- **Hosting**: Vercel (Frontend), Supabase (Backend)
- **State Management**: Zustand 4.5 (전역 상태 관리)
- **Analytics**: Google Analytics 4
- **Monitoring**: Sentry

# 2. Architecture

**Client-Server 아키텍처**를 따르며, Next.js App Router로 SSR/CSR 하이브리드 렌더링을 구현합니다.

**데이터 흐름 (Lazy Registration 중심)**:

1. **유저 → 클라이언트(Next.js)**: 데이터 입력 → `localStorage` 저장
2. **클라이언트 → Supabase**: Query-only API 호출 (`POST /api/scholarships/query`)
3. **Supabase → 클라이언트**: 매칭된 장학금 리스트 리턴 (DB 저장 X)
4. **회원가입 → 데이터 이관**: Token 발급 후 `POST /api/user/preferences` 호출 → DB INSERT
5. **관리자 → PUSH 발송**: Edge Function 배치 처리 → FCM 전송

# 3. Database Schema

```sql
-- ========================================
-- 1. departments (학과 정보)
-- ========================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college TEXT NOT NULL, -- 단과대학명
  name TEXT NOT NULL, -- 학과명
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 동국대학교 전체 학과 데이터 삽입
INSERT INTO departments (college, name) VALUES
  -- 불교대학
  ('불교대학', '문화재학과'),
  ('불교대학', '불교학부'),
  
  -- 문과대학
  ('문과대학', '국어국문문예창작학부'),
  ('문과대학', '사학과'),
  ('문과대학', '영어영문학부'),
  ('문과대학', '일본학과'),
  ('문과대학', '중어중문학과'),
  ('문과대학', '철학과'),
  
  -- 이과대학
  ('이과대학', '물리·반도체과학부'),
  ('이과대학', '수학과'),
  ('이과대학', '통계학과'),
  ('이과대학', '화학과'),
  
  -- 법과대학
  ('법과대학', '법학과'),
  
  -- 사회과학대학
  ('사회과학대학', '경제학과'),
  ('사회과학대학', '광고홍보학과'),
  ('사회과학대학', '국제통상학전공'),
  ('사회과학대학', '미디어커뮤니케이션학전공'),
  ('사회과학대학', '북한학전공'),
  ('사회과학대학', '사회복지학과'),
  ('사회과학대학', '사회학전공'),
  ('사회과학대학', '식품산업관리학과'),
  ('사회과학대학', '정치외교학전공'),
  ('사회과학대학', '행정학전공'),
  
  -- 경찰사법대학
  ('경찰사법대학', '경찰행정학부'),
  
  -- 경영대학
  ('경영대학', '경영정보학과'),
  ('경영대학', '경영학과'),
  ('경영대학', '회계학과'),
  
  -- 바이오시스템대학
  ('바이오시스템대학', '바이오환경과학과'),
  ('바이오시스템대학', '생명과학과'),
  ('바이오시스템대학', '식품생명공학과'),
  ('바이오시스템대학', '의생명공학과'),
  
  -- 공과대학
  ('공과대학', '건설환경공학과'),
  ('공과대학', '건축학전공'),
  ('공과대학', '기계로봇에너지공학과'),
  ('공과대학', '산업시스템공학과'),
  ('공과대학', '에너지신소재공학과'),
  ('공과대학', '전자전기공학부'),
  ('공과대학', '정보통신공학전공'),
  ('공과대학', '화공생물공학과'),
  
  -- 첨단융합대학
  ('첨단융합대학', '시스템반도체학부'),
  ('첨단융합대학', '의료인공지능공학과'),
  ('첨단융합대학', '지능형네트워크융합학과'),
  ('첨단융합대학', '컴퓨터·AI학부'),
  
  -- 사범대학
  ('사범대학', '가정교육과'),
  ('사범대학', '교육학과'),
  ('사범대학', '국어교육과'),
  ('사범대학', '수학교육과'),
  ('사범대학', '역사교육과'),
  ('사범대학', '지리교육과'),
  ('사범대학', '체육교육과'),
  
  -- 예술대학
  ('예술대학', '미술학부'),
  ('예술대학', '연극학부'),
  ('예술대학', '영화영상학과'),
  ('예술대학', '한국음악과'),
  
  -- 약학대학
  ('약학대학', '약학과'),
  
  -- 미래융합대학
  ('미래융합대학', '글로벌무역학과'),
  ('미래융합대학', '사회복지상담학과'),
  ('미래융합대학', '융합보안학과');

-- ========================================
-- 2. users (사용자 정보) - 최종 수정본
-- ========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  auth_provider TEXT CHECK (auth_provider IN ('email', 'kakao', 'google')),
  
  -- 필수 정보
  department_id UUID REFERENCES departments(id) NOT NULL, -- 학과 고유 ID (데이터 관리용)
  department_name TEXT NOT NULL, -- [추가됨] 학과 이름 (예: 컴퓨터공학과) - 바로 보여주기 용도
  college TEXT NOT NULL, -- [추가됨] 단과대 이름 (예: 공과대학) - 바로 보여주기 용도
  
  grade INTEGER CHECK (grade BETWEEN 1 AND 4) NOT NULL, -- 학년
  avg_gpa DECIMAL(3,2) CHECK (avg_gpa BETWEEN 0 AND 4.5), -- 평균 평점
  prev_semester_gpa DECIMAL(3,2) CHECK (prev_semester_gpa BETWEEN 0 AND 4.5), -- 직전 학기 평점
  
  -- 소득분위 (0~10: 구간, 11: 본인 구간 모름)
	-- [쿼리 로직 명시] income_bracket = 11인 유저는:
	--   1. max_income_bracket IS NULL (소득분위 무관) 장학금: 노출 O
	--   2. max_income_bracket <= 10 (특정 구간 제한) 장학금: 노출 X
	--   3. 즉, "구간 모름" 유저에게는 소득분위 조건이 없는 장학금만 추천
	-- [예시 쿼리]
	--   WHERE (s.max_income_bracket IS NULL OR (u.income_bracket <= 10 AND u.income_bracket <= s.max_income_bracket))
	income_bracket INTEGER CHECK (income_bracket BETWEEN 0 AND 11) DEFAULT 11,

  
  hometown_region TEXT, -- 출신 지역
  enrollment_status TEXT CHECK (enrollment_status IN ('enrolled', 'on_leave')) NOT NULL, -- 재학/휴학
  
  -- 선택 정보
  has_disability BOOLEAN DEFAULT FALSE, -- 장애 여부
  is_multi_child_family BOOLEAN DEFAULT FALSE, -- 다자녀 여부
    
  -- PUSH 알림 설정 (모바일 Only라 단일 컬럼 유지)
  fcm_token TEXT, 
  push_enabled BOOLEAN DEFAULT TRUE,
  
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 3. scholarships (장학금 정보)
-- ========================================
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- 장학금명
  url TEXT NOT NULL, -- 원본 공지사항 링크
  category TEXT CHECK (category IN ('tuition', 'living', 'mixed')) NOT NULL, -- 등록금성/생활비성/혼합지원
  amount_text TEXT, -- [화면 표시용 금액 (예: "등록금 전액", "매달 30만원") - 실제 UI엔 이걸 노출
  
  -- 마감 정보
  deadline DATE NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE, -- 마감 여부
  
  -- 필터링 조건 (NULL이면 조건 없음)
  target_grades INTEGER[], -- 대상 학년 (예: ARRAY[1, 2, 3, 4], NULL이면 전체)
  target_departments UUID[], -- 대상 학과 ID 배열 (NULL이면 전체)
  target_colleges TEXT[], -- 대상 단과대학 (예: ARRAY['문과대학', '이과대학'], NULL이면 전체)
  min_avg_gpa DECIMAL(3,2), -- 최소 평균 평점 조건 (NULL이면 조건 없음)
  min_prev_semester_gpa DECIMAL(3,2), -- 최소 직전 학기 평점 조건 (NULL이면 조건 없음)
  max_income_bracket INTEGER, -- 최대 소득분위 (예: 8이면 1~8분위만 가능, NULL이면 조건 없음)
  target_hometown_regions TEXT[], -- 대상 출신 지역 (예: ARRAY['서울시', '부산시'], NULL이면 전체)
  enrollment_status TEXT[], -- 대상 재학 상태 (예: ARRAY['enrolled', 'on_leave'], NULL이면 전체)
  
  -- 선택 조건
  requires_disability BOOLEAN DEFAULT FALSE, -- 장애인 대상 여부
  requires_multi_child BOOLEAN DEFAULT FALSE, -- 다자녀 가구 대상 여부
  requires_national_merit BOOLEAN DEFAULT FALSE, -- 국가보훈대상자 여부
  
  -- 메타 정보
  description TEXT, -- 상세 내용
  documents_required TEXT, -- 제출 서류
  is_duplicate_allowed BOOLEAN, -- 중복 수혜 가능 여부
  push_sent BOOLEAN DEFAULT FALSE, -- PUSH 알림 발송 여부
  
  -- 크롤링 확장 대비 필드 (현재는 NULL)
  source_url TEXT, -- 크롤링 원본 URL (추후 자동화 시 사용)
  last_crawled_at TIMESTAMPTZ, -- 마지막 크롤링 시각
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_is_closed ON scholarships(is_closed);
CREATE INDEX idx_scholarships_push_sent ON scholarships(push_sent);
CREATE INDEX idx_scholarships_target_grades ON scholarships USING GIN(target_grades);

-- ========================================
-- 4. scraps (찜하기)
-- ========================================
CREATE TABLE scraps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, scholarship_id) -- 중복 찜 방지
);

CREATE INDEX idx_scraps_user ON scraps(user_id);
CREATE INDEX idx_scraps_scholarship ON scraps(scholarship_id);

-- ========================================
-- 4-1. scholarship_clicks (성과 측정 - 아웃링크 클릭 로그)
-- ========================================
CREATE TABLE scholarship_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- 탈퇴한 유저 로그도 남길지 결정 (SET NULL 권장)
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scholarship_clicks_date ON scholarship_clicks(clicked_at);

-- ========================================
-- 5. notifications (PUSH 알림 로그)
-- ========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL, -- 알림 제목
  body TEXT NOT NULL, -- 알림 본문
  
  scheduled_at TIMESTAMPTZ DEFAULT NOW(), -- [추가됨] 예약 발송 시간
  sent BOOLEAN DEFAULT FALSE, -- [추가됨] 발송 완료 여부 (배치 처리용)
  sent_at TIMESTAMPTZ, -- [수정됨] 실제 발송 시각 (NULL 허용, sent=true일 때 업데이트)
  
  clicked BOOLEAN DEFAULT FALSE, -- 클릭 여부 (CTR 추적용)
  clicked_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scholarship ON notifications(scholarship_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at, sent); -- 배치 처리 최적화용

-- ========================================
-- 5-1. access_logs (홈 화면 접속 로그 - 빈 화면 비율 측정용)
-- ========================================
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  matched_scholarship_count INTEGER NOT NULL, -- 접속 시점에 매칭된 장학금 개수 (0이면 빈 화면)
  
  CONSTRAINT valid_count CHECK (matched_scholarship_count >= 0)
);

CREATE INDEX idx_access_logs_user ON access_logs(user_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_access_logs_count_zero ON access_logs(matched_scholarship_count) WHERE matched_scholarship_count = 0;

-- ========================================
-- 6. admin_users (관리자 계정)
-- ========================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('super_admin', 'editor')) DEFAULT 'editor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

# 4. Third-party Integrations

- **Supabase Auth**: 소셜 로그인 (카카오/구글)
- **Firebase Cloud Messaging (FCM)**: PUSH 알림 발송
- **Google Analytics 4**: 사용자 행동 분석
- **Sentry**: 에러 추적
- **Vercel**: 프론트엔드 배포

# 5. Compatibility

- **Browser:** Chrome 90+, Safari 14+, Samsung Internet 15+, Edge 90+ 지원
- **Device:** iOS 14+ (iPhone SE 2세대 이상), Android 10+ (삼성/LG 주요 기종)
- **Network:** 3G 환경(~1Mbps)에서도 첫 화면 로딩 10초 이내 목표

# 6. Accessibility

- **WCAG 2.1 Level AA:** 텍스트 명도 대비 4.5:1 이상 준수
- **Touch Target:** 모바일 터치 영역 최소 44px × 44px 확보
- **Screen Reader:** 모든 이미지에 alt 텍스트, 폼 입력 필드에 label 연결

# 7. Performance Targets

- **FCP (First Contentful Paint):** 모바일 기준 2.5초 이내
- **Lighthouse:** Performance 85점, PWA 100점 달성 목표
- **Data Usage:** 페이지당 평균 800KB 이하 (이미지 최적화 필수)
- **API Response:** 홈 피드 조회 1.5초 이내 완료

# 8. Security & Deployment

- **HTTPS:** 전 구간 HTTPS 필수 (Vercel/Supabase 기본 제공)
- **RLS (Row Level Security):**
    - 기본 원칙: 본인의 데이터만 조회/수정 가능.
    - **(Dev Note 중요):** '찜한 장학금' 조회 시에는 장학금 원본이 숨김 처리(`is_hidden=true`)되었더라도 리스트에서 사라지지 않도록 예외 쿼리를 작성할 것 (사용자 경험 보호).
- **Soft Delete:**
    - **(Dev Note 중요):** 장학금이나 유저 데이터 삭제 시 DB에서 `DELETE` 문을 쓰지 말고, `is_hidden=true` 또는 `deleted_at` 타임스탬프를 찍는 Soft Delete 방식을 사용할 것.
- **Deployment:**
    - Frontend: Vercel GitHub 연동 (git push 시 자동 배포)
    - Backend: Supabase Edge Functions 배포

📊 무료 운영 가이드 (Server Limit Checklist)

1. **Supabase (Free Plan):**
    - **DB 용량:** 500MB 제한 (약 2,000명 유저까지 안정권).
    - **주의사항:** 로그 데이터(access_logs 등)가 쌓이면 주기적으로 삭제하거나 요약 테이블로 변환 필요.
2. **FCM (Firebase):** 발송 건수 무제한 무료.
3. **Vercel (Hobby Plan):** 월 대역폭 100GB (MVP 단계에서 충분함).