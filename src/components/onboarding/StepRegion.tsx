'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { REGIONS } from '@/data/departments';

interface StepRegionProps {
    region?: string;
    hasDisability: boolean;
    isMultiChild: boolean;
    isNationalMerit: boolean;
    onChange: (data: {
        hometown_region?: string;
        has_disability?: boolean;
        is_multi_child_family?: boolean;
        is_national_merit?: boolean;
    }) => void;
    onSubmit: () => void;
    onPrev: () => void;
}

/**
 * StepRegion
 * 거주지 및 추가 정보 입력 스텝
 * 
 * PRD 기준:
 * - 출신 고교 지역
 * - 다자녀, 장애인, 국가유공자 체크박스
 */
export function StepRegion({
    region,
    hasDisability,
    isMultiChild,
    isNationalMerit,
    onChange,
    onSubmit,
    onPrev
}: StepRegionProps) {

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#212121]">거주지와 추가 정보를<br />확인해주세요</h2>
            </div>

            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-base font-semibold text-[#212121]">출신 고교 지역</label>
                    <Select value={region} onValueChange={(val) => onChange({ hometown_region: val })}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="지역 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <label className="text-base font-semibold text-[#212121]">해당하는 항목이 있나요?</label>

                    <div className="space-y-3">
                        <div
                            className={cn(
                                "flex items-center space-x-3 p-3 border rounded-lg hover:bg-[#F8F9FA] cursor-pointer transition-colors",
                                isMultiChild ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-[#E0E0E0]"
                            )}
                            onClick={() => onChange({ is_multi_child_family: !isMultiChild })}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                isMultiChild ? "bg-[#FF6B35] border-[#FF6B35]" : "border-[#BDBDBD]"
                            )}>
                                {isMultiChild && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="cursor-pointer flex-1 font-normal text-[#212121]">다자녀 가구입니다</span>
                        </div>

                        <div
                            className={cn(
                                "flex items-center space-x-3 p-3 border rounded-lg hover:bg-[#F8F9FA] cursor-pointer transition-colors",
                                hasDisability ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-[#E0E0E0]"
                            )}
                            onClick={() => onChange({ has_disability: !hasDisability })}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                hasDisability ? "bg-[#FF6B35] border-[#FF6B35]" : "border-[#BDBDBD]"
                            )}>
                                {hasDisability && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="cursor-pointer flex-1 font-normal text-[#212121]">장애인 본인 또는 자녀입니다</span>
                        </div>

                        <div
                            className={cn(
                                "flex items-center space-x-3 p-3 border rounded-lg hover:bg-[#F8F9FA] cursor-pointer transition-colors",
                                isNationalMerit ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-[#E0E0E0]"
                            )}
                            onClick={() => onChange({ is_national_merit: !isNationalMerit })}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                isNationalMerit ? "bg-[#FF6B35] border-[#FF6B35]" : "border-[#BDBDBD]"
                            )}>
                                {isNationalMerit && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="cursor-pointer flex-1 font-normal text-[#212121]">국가유공자 본인 또는 자녀입니다</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
                    이전
                </Button>
                <Button
                    className="flex-[2] h-12 text-base"
                    disabled={!region}
                    onClick={onSubmit}
                >
                    내 장학금 보기
                </Button>
            </div>
        </div>
    );
}
