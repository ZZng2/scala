'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/lib/supabase/client';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';

interface HeaderProps {
    /** 
     * 초기 로그인 상태 (옵션)
     * 클라이언트 사이드에서 다시 확인하므로 필수는 아님 
     */
    isLoggedIn?: boolean;
    /** 페이지 제목 (중앙 표시) */
    title?: string;
    /** 뒤로가기 버튼 표시 여부 */
    showBack?: boolean;
    /** 뒤로가기 클릭 핸들러 */
    onBack?: () => void;
    /** 로고 표시 여부 */
    showLogo?: boolean;
}

/**
 * Header (GNB)
 * 전역 네비게이션 바
 * 
 * PRD 기준:
 * - 높이: 56px (모바일), 64px (데스크탑)
 * - 배경: #FFFFFF
 * - 하단 보더: 1px solid #E0E0E0
 * - 좌측: 스칼라 로고
 * - 우측: 프로필 아이콘 (조건부 Popover)
 */
export function Header({
    isLoggedIn: initialIsLoggedIn = false,
    title,
    showBack = false,
    onBack,
    showLogo = true
}: HeaderProps) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
    const [showPushGuide, setShowPushGuide] = useState(false);

    useEffect(() => {
        // 초기 세션 확인
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session);
        });

        // Auth 상태 변경 구독
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        router.push('/'); // 랜딩 페이지로 이동
        router.refresh(); // 상태 갱신
    };

    return (
        <header className="sticky top-0 z-30 h-14 md:h-16 bg-white border-b border-[#E0E0E0]">
            <div className="h-full max-w-[480px] mx-auto px-4 flex items-center justify-between">
                {/* 좌측: 로고 또는 뒤로가기 */}
                <div className="flex items-center">
                    {showBack ? (
                        <button
                            onClick={onBack}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="뒤로가기"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : showLogo ? (
                        <Link href="/home" className="flex items-center gap-2">
                            <img
                                src="/images/symbol_logo.png"
                                alt="Scala Logo"
                                className="w-8 h-8 object-contain rounded-full"
                            />
                            <span className="text-xl font-bold text-[#FF6B35]">Scala</span>
                        </Link>
                    ) : (
                        <div className="w-10" />
                    )}
                </div>

                {/* 중앙: 페이지 제목 */}
                {title && (
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-[#212121]">
                        {title}
                    </h1>
                )}

                {/* 우측: 프로필 아이콘 */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="메뉴"
                        >
                            <User className="w-6 h-6 text-[#757575]" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        className="w-48 p-1 bg-white border border-[#E0E0E0] shadow-[0px_8px_24px_rgba(0,0,0,0.16)]"
                    >
                        {isLoggedIn ? (
                            // 로그인 상태
                            <div className="flex flex-col">
                                <Link
                                    href="/scraps"
                                    className="px-3 py-2.5 text-sm text-[#212121] hover:bg-[#F8F9FA] rounded-md transition-colors"
                                >
                                    찜 목록
                                </Link>
                                <Link
                                    href="/mypage"
                                    className="px-3 py-2.5 text-sm text-[#212121] hover:bg-[#F8F9FA] rounded-md transition-colors"
                                >
                                    내 정보 수정
                                </Link>
                                <button
                                    className="px-3 py-2.5 text-sm text-[#212121] hover:bg-[#F8F9FA] rounded-md transition-colors text-left w-full"
                                    onClick={() => setShowPushGuide(true)}
                                >
                                    PUSH 알림 가이드
                                </button>
                                <button
                                    className="px-3 py-2.5 text-sm text-[#F44336] hover:bg-[#F8F9FA] rounded-md transition-colors text-left w-full"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            // 비로그인 상태
                            <div className="flex flex-col">
                                <Link
                                    href="/signup"
                                    className="px-3 py-2.5 text-sm text-[#FF6B35] font-medium hover:bg-[#F8F9FA] rounded-md transition-colors"
                                >
                                    회원가입
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-3 py-2.5 text-sm text-[#212121] hover:bg-[#F8F9FA] rounded-md transition-colors"
                                >
                                    로그인
                                </Link>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            {/* PUSH 알림 가이드 모달 */}
            <IOSInstallGuideModal open={showPushGuide} onClose={() => setShowPushGuide(false)} />
        </header>
    );
}
