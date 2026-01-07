'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DetailHeaderProps {
    scholarship: {
        id: string;
        title: string;
        category: 'tuition' | 'living' | 'mixed';
        amount_text: string | null;
        deadline: string;
        d_day: number;
        organization?: string;
    };
}

/**
 * DetailHeader
 * 장학금 상세 페이지 헤더
 * 
 * PRD 기준:
 * - D-Day 뱃지
 * - 카테고리 뱃지
 * - 장학금명
 * - 지원 금액
 * - 주관/마감일 요약
 */
export function DetailHeader({ scholarship }: DetailHeaderProps) {
    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'tuition': return '등록금성';
            case 'living': return '생활비성';
            case 'mixed': return '복합지원';
            default: return '기타';
        }
    };

    const getCategoryBadgeClass = (cat: string) => {
        switch (cat) {
            case 'tuition': return 'bg-blue-50 text-blue-600 border-none';
            case 'living': return 'bg-green-50 text-green-600 border-none';
            case 'mixed': return 'bg-purple-50 text-purple-600 border-none';
            default: return '';
        }
    };

    return (
        <div className="bg-white px-6 pt-6 pb-6 border-b border-[#E0E0E0]/50">
            <div className="flex items-center gap-2 mb-3">
                <Badge variant="dday" className="bg-[#FF6B35]/10 text-[#FF6B35] border-none px-2 py-0.5 text-xs font-semibold">
                    D-{scholarship.d_day}
                </Badge>
                <Badge variant="outline" className={`${getCategoryBadgeClass(scholarship.category)} font-normal text-xs`}>
                    {getCategoryLabel(scholarship.category)}
                </Badge>
            </div>

            <h1 className="text-2xl font-bold text-[#212121] leading-tight mb-4">
                {scholarship.title}
            </h1>

            <div className="flex flex-col gap-1">
                <span className="text-sm text-[#757575]">지원 금액</span>
                <span className="text-xl font-bold text-[#FF6B35]">
                    {scholarship.amount_text || '금액 미정'}
                </span>
            </div>

            <div className="mt-6 p-4 bg-[#F8F9FA] rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[#757575]">주관</span>
                    <span className="font-medium text-[#212121]">{scholarship.organization || '동국대학교'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[#757575]">마감일</span>
                    <span className="font-medium text-[#212121]">{new Date(scholarship.deadline).toLocaleDateString('ko-KR')}</span>
                </div>
            </div>
        </div>
    );
}
