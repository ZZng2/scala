'use client';

import React from 'react';
import Link from 'next/link';

/**
 * StickyCTA
 * 랜딩 페이지 하단 고정 CTA 바 (모바일 전용)
 * 
 * PRD 기준:
 * - 배경: Linear Gradient #FF6B35 → #FF8C5A
 * - 높이: 64px
 * - 모바일에서만 표시 (md:hidden)
 */
export function StickyCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] flex items-center justify-between px-4 md:px-6 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] md:hidden safe-bottom">
            <div className="flex flex-col justify-center">
                <span className="text-white font-semibold text-[16px]">
                    회원가입 하고 PUSH 알림 받기
                </span>
            </div>
            <Link
                href="/signup"
                className="h-[32px] px-4 bg-white text-[#FF6B35] text-sm font-bold rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap ml-4 flex items-center"
            >
                가입하기
            </Link>
        </div>
    );
}
