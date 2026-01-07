'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    /** 제목 */
    title?: string;
    /** 설명 문구 */
    description?: string;
    /** CTA 버튼 텍스트 */
    ctaText?: string;
    /** CTA 클릭 핸들러 */
    onCtaClick?: () => void;
    /** CTA 하단 보조 문구 */
    ctaSubtext?: string;
}

/**
 * EmptyState
 * 조건에 맞는 장학금이 0개일 경우 표시하는 위로 화면
 * 
 * PRD 기준:
 * - 아이콘/일러스트: 돋보기와 망원경을 든 캐릭터
 * - Headline: "조건에 딱 맞는 공고가 아직 없어요."
 * - Subtext: 위로 문구
 * - CTA: "3초 만에 알림 예약하기"
 */
export function EmptyState({
    title = "조건에 딱 맞는 공고가 아직 없어요.",
    description = "하지만 내일 당장 올라올 수도 있어요.\n스칼라가 매일 지켜보다가 뜨면 바로 알려드릴까요?",
    ctaText = "3초 만에 알림 예약하기",
    onCtaClick,
    ctaSubtext = "카카오로 간편하게 시작"
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* 아이콘 */}
            <div className="w-24 h-24 bg-[#FFF7ED] rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-[#FF6B35]" />
            </div>

            {/* 제목 */}
            <h2 className="text-xl font-bold text-[#212121] mb-3">
                {title}
            </h2>

            {/* 설명 */}
            <p className="text-sm text-[#757575] whitespace-pre-line mb-8 max-w-[280px]">
                {description}
            </p>

            {/* CTA 버튼 */}
            <Button
                variant="default"
                size="cta"
                onClick={onCtaClick}
                className="w-full max-w-[280px]"
            >
                {ctaText}
            </Button>

            {/* CTA 보조 문구 */}
            {ctaSubtext && (
                <p className="text-xs text-[#BDBDBD] mt-2">
                    {ctaSubtext}
                </p>
            )}
        </div>
    );
}
