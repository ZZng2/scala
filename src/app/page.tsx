'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 메인 페이지 - 라우팅 분기점
 * 
 * PRD Global Routing Rule:
 * 1. Token 보유 유저 (회원): → /home
 * 2. Token 없음 + 임시 데이터 보유 (비회원 재방문): → /home
 * 3. Token 없음 + 임시 데이터 없음 (신규 방문자): → /landing
 */
export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check auth token
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Case 1: 회원 - 바로 홈으로
      router.replace('/home');
      return;
    }

    // Check temp user data
    const tempData = localStorage.getItem('temp_user_data');

    if (tempData) {
      // Case 2: 비회원 재방문 - 홈으로 (StickyBar 표시됨)
      router.replace('/home');
      return;
    }

    // Case 3: 신규 방문자 - 랜딩으로
    router.replace('/landing');
  }, [router]);

  // 로딩 화면 (라우팅 전)
  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return null;
}
