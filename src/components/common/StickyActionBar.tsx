'use client';

import React, { useState } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StickyActionBarProps {
    /** 장학금 ID */
    scholarshipId: string;
    /** 스크랩 여부 */
    isScrapped?: boolean;
    /** 남은 일수 */
    dDay?: number;
    /** 외부 링크 URL */
    externalUrl: string;
    /** 스크랩 토글 핸들러 */
    onScrapToggle?: (id: string, isScrapped: boolean) => void;
}

/**
 * StickyActionBar
 * 장학금 상세 페이지 하단 고정 액션 바
 * 
 * PRD 기준:
 * - 찜(하트) 버튼
 * - '장학금 받으러 가기' 버튼 (외부 링크)
 * - 배경: 오렌지 그라디언트
 */
export function StickyActionBar({
    scholarshipId,
    isScrapped = false,
    dDay,
    externalUrl,
    onScrapToggle
}: StickyActionBarProps) {
    const [scrapped, setScrapped] = useState(isScrapped);

    const handleScrap = () => {
        const newState = !scrapped;
        setScrapped(newState);
        onScrapToggle?.(scholarshipId, newState);

        toast.success(
            newState ? '장학금을 스크랩했습니다.' : '스크랩을 해제했습니다.',
            {
                description: newState ? '마이페이지에서 확인할 수 있습니다.' : undefined
            }
        );
    };

    const handleApply = () => {
        // TODO: scholarship_clicks 테이블에 로그 저장
        console.log('Click logged for scholarship:', scholarshipId);

        // 새 창으로 외부 링크 열기
        window.open(externalUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none safe-bottom">
            <div className="w-full max-w-[480px] pointer-events-auto">
                <div
                    className="h-16 w-full px-4 flex items-center justify-between shadow-sticky"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C5A 100%)' }}
                >
                    {/* 좌측: 찜 버튼 + D-Day */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleScrap}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label={scrapped ? '스크랩 해제' : '스크랩'}
                        >
                            <Heart
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    scrapped ? "fill-white text-white" : "text-white"
                                )}
                            />
                        </button>
                        {dDay !== undefined && dDay >= 0 && (
                            <span className="text-white font-semibold text-sm hidden sm:block">
                                마감까지 {dDay}일
                            </span>
                        )}
                    </div>

                    {/* 우측: 지원 버튼 */}
                    <Button
                        onClick={handleApply}
                        variant="white"
                        className="h-10 px-6 rounded-full font-bold text-sm shadow-md flex items-center gap-2"
                    >
                        장학금 받으러 가기
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
