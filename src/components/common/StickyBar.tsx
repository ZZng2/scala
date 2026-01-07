'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StickyBarProps {
    /** 표시 여부를 외부에서 제어할 때 사용 */
    show?: boolean;
}

/**
 * StickyBar (Conversion)
 * 비회원 상태에서 회원가입 전환을 유도하는 하단 고정 바
 * 
 * PRD 기준:
 * - 배경: Linear Gradient #FF6B35 → #FF8C5A
 * - 높이: 64px
 * - 위치: 하단 고정 (Bottom Sticky)
 */
export function StickyBar({ show = true }: StickyBarProps) {
    if (!show) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none safe-bottom"
            role="banner"
            aria-label="회원가입 안내"
        >
            <div className="w-full max-w-[480px] pointer-events-auto">
                <div
                    className="h-16 w-full px-4 flex items-center justify-between shadow-sticky"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C5A 100%)' }}
                >
                    {/* 텍스트 영역 */}
                    <div className="flex flex-col justify-center">
                        <span className="text-white font-bold text-[15px] leading-tight">
                            정보가 임시 저장 중이에요!
                        </span>
                        <span className="text-white/90 text-[11px] leading-tight mt-0.5">
                            카카오로 3초 만에 가입하고 알림 받기
                        </span>
                    </div>

                    {/* CTA 버튼 */}
                    <Button
                        asChild
                        variant="white"
                        size="inline"
                        className="rounded-full shadow-md"
                    >
                        <Link href="/signup">
                            가입하기
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
