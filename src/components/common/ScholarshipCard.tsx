'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ScholarshipCardData } from '@/types';

interface ScholarshipCardProps {
    scholarship: ScholarshipCardData;
    onScrapToggle?: (id: string, isScrapped: boolean) => void;
    showScrapButton?: boolean;
}

/**
 * ScholarshipCard
 * 장학금 리스트에서 개별 장학금을 표시하는 카드 컴포넌트
 * 
 * PRD 기준:
 * - 장학금명(Bold), 카테고리 뱃지, 지원 금액(오렌지색), D-Day
 * - D-Day 순 정렬 (마감 임박한 공고가 가장 위)
 * - 마감된 공고: Opacity 50%
 */
export function ScholarshipCard({
    scholarship,
    onScrapToggle,
    showScrapButton = false
}: ScholarshipCardProps) {
    const { id, title, category, amount_text, deadline, d_day, is_closed, is_scrapped } = scholarship;

    // D-Day 표시 텍스트
    const getDDayText = () => {
        if (is_closed || d_day < 0) return '마감';
        if (d_day === 0) return 'D-Day';
        return `D-${d_day}`;
    };

    // 카테고리 뱃지 텍스트
    const getCategoryText = () => {
        switch (category) {
            case 'tuition': return '등록금';
            case 'living': return '생활비';
            case 'mixed': return '복합';
        }
    };

    const handleScrapClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onScrapToggle?.(id, !is_scrapped);
    };

    return (
        <Link href={`/scholarship/${id}`}>
            <Card
                className={cn(
                    "hover:shadow-[0px_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 border-[#E0E0E0] overflow-hidden cursor-pointer",
                    is_closed && "opacity-50"
                )}
            >
                <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-start gap-2">
                        {/* 카테고리 뱃지 */}
                        <div className="flex flex-wrap gap-2">
                            <Badge variant={category}>
                                {getCategoryText()}
                            </Badge>
                        </div>

                        {/* D-Day */}
                        <div className="flex items-center gap-2">
                            {showScrapButton && (
                                <button
                                    onClick={handleScrapClick}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label={is_scrapped ? '스크랩 해제' : '스크랩'}
                                >
                                    <Heart
                                        className={cn(
                                            "w-5 h-5 transition-colors",
                                            is_scrapped ? "fill-[#FF6B35] text-[#FF6B35]" : "text-[#BDBDBD]"
                                        )}
                                    />
                                </button>
                            )}
                            <Badge variant={is_closed ? 'closed' : 'dday'}>
                                {getDDayText()}
                            </Badge>
                        </div>
                    </div>

                    {/* 장학금 제목 */}
                    <CardTitle className="text-base font-bold leading-snug mt-2 text-[#212121] line-clamp-2">
                        {title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 px-4 pt-0">
                    {/* 지원 금액 */}
                    <p className="text-xl font-bold text-[#FF6B35] mb-1">
                        {amount_text || '금액 미정'}
                    </p>

                    {/* 마감일 */}
                    <div className="flex items-center text-sm text-[#757575] gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>~ {new Date(deadline).toLocaleDateString('ko-KR')} 마감</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
