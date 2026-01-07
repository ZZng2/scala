'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DetailContentProps {
    scholarship: {
        target_summary?: string;
        support_conditions?: string;
        description?: string | null;
        documents_required?: string | null;
        is_duplicate_allowed?: boolean | null;
    };
}

/**
 * DetailContent
 * 장학금 상세 내용 컴포넌트
 * 
 * PRD 기준:
 * - 지원 대상
 * - 중복 수혜 여부
 * - 상세 설명
 * - 제출 서류
 */
export function DetailContent({ scholarship }: DetailContentProps) {
    return (
        <div className="bg-white px-6 py-8 flex flex-col gap-8">

            {/* Target Section */}
            <section>
                <h3 className="text-lg font-bold text-[#212121] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#FF6B35]" />
                    지원 대상
                </h3>
                <p className="text-[#212121]/80 leading-relaxed whitespace-pre-line">
                    {scholarship.target_summary || '상세 내용을 확인해 주세요.'}
                </p>
                {scholarship.support_conditions && (
                    <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{scholarship.support_conditions}</span>
                    </div>
                )}
            </section>

            <div className="h-px bg-[#E0E0E0]" />

            {/* Description Section */}
            {scholarship.description && (
                <>
                    <section>
                        <h3 className="text-lg font-bold text-[#212121] mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#FF6B35]" />
                            상세 내용
                        </h3>
                        <p className="text-[#212121]/80 leading-relaxed whitespace-pre-line">
                            {scholarship.description}
                        </p>
                    </section>
                    <div className="h-px bg-[#E0E0E0]" />
                </>
            )}

            {/* Documents Section */}
            {scholarship.documents_required && (
                <>
                    <section>
                        <h3 className="text-lg font-bold text-[#212121] mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#FF6B35]" />
                            제출 서류
                        </h3>
                        <p className="text-[#212121]/80 leading-relaxed whitespace-pre-line">
                            {scholarship.documents_required}
                        </p>
                    </section>
                    <div className="h-px bg-[#E0E0E0]" />
                </>
            )}

            {/* Duplicate Info */}
            <section className="w-full">
                <h3 className="text-lg font-bold text-[#212121] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#FF6B35]" />
                    중복 수혜
                </h3>
                <p className="text-[#212121]/80 leading-relaxed">
                    {scholarship.is_duplicate_allowed
                        ? '타 장학금과 중복 수혜가 가능합니다.'
                        : '타 장학금과 중복 수혜가 불가능합니다.'}
                </p>
            </section>

            {/* Bottom Spacer for sticky bar */}
            <div className="h-12" />
        </div>
    );
}
