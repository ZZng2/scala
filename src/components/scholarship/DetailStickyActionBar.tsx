'use client';

import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { logAnalyticsEvent } from '@/lib/firebase';

interface DetailStickyActionBarProps {
    scholarship: {
        id: string;
        d_day: number;
        url?: string;
    };
    isScrapped?: boolean;
    onScrapToggle?: (isScrapped: boolean) => void;
}

/**
 * DetailStickyActionBar
 * 장학금 상세 페이지 하단 액션 바
 * 
 * PRD 기준:
 * - 찜하기 버튼 (하트)
 * - 장학금 받으러 가기 버튼 (외부 링크)
 */
export function DetailStickyActionBar({ scholarship, isScrapped = false, onScrapToggle }: DetailStickyActionBarProps) {
    const handleScrap = () => {
        const newState = !isScrapped;
        onScrapToggle?.(newState);
        // Toast messages moved to parent component (page.tsx) to show after login check
    };

    const handleApply = async () => {
        // Analytics: 장학금 클릭 로그 저장
        try {
            await fetch('/api/analytics/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'outbound_link_clicked',
                    scholarship_id: scholarship.id,
                }),
            });

            // Google Analytics logging
            logAnalyticsEvent('scholarship_click', {
                scholarship_id: scholarship.id,
                scholarship_title: (scholarship as any).title || 'unknown',
            });
        } catch (error) {
            console.error('Analytics logging failed:', error);
        }

        // Open link
        const url = scholarship.url || 'https://www.dongguk.edu/article/SCHOLARSHIP';
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none safe-bottom">
            <div className="w-full max-w-[480px] pointer-events-auto">
                <div
                    className="h-16 w-full px-4 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.1)]"
                    style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C5A 100%)' }}
                >

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleScrap}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="스크랩"
                        >
                            <Heart
                                className={`w-6 h-6 transition-colors ${isScrapped ? 'fill-white text-white' : 'text-white'}`}
                            />
                        </button>
                        <span className="text-white font-semibold text-sm hidden sm:block">
                            마감까지 {scholarship.d_day}일
                        </span>
                    </div>

                    <button
                        onClick={handleApply}
                        className="h-10 px-6 rounded-full bg-white text-[#FF6B35] font-bold text-sm shadow-md hover:bg-white/90 transition-colors flex items-center gap-2"
                    >
                        장학금 받으러 가기
                        <ExternalLink className="w-4 h-4" />
                    </button>

                </div>
            </div>
        </div>
    );
}
