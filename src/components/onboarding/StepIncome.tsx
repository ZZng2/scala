'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface StepIncomeProps {
    incomeBracket?: number;
    onChange: (value: number) => void;
    onNext: () => void;
    onPrev: () => void;
}

/**
 * StepIncome
 * 소득분위 선택 스텝
 * 
 * PRD 기준:
 * - 0-10 구간 선택
 * - 11 = 잘 모르겠어요 (전체 알림)
 */
export function StepIncome({ incomeBracket, onChange, onNext, onPrev }: StepIncomeProps) {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#212121]">소득분위를 알려주세요</h2>
                    <div className="relative group">
                        <Info className="w-5 h-5 text-[#757575] cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-[#212121] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            한국장학재단 기준 소득구간입니다.
                        </div>
                    </div>
                </div>
                <p className="text-[#757575]">정확한 장학금 추천을 위해 필요해요.</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                            key={num}
                            onClick={() => onChange(num)}
                            className={cn(
                                "h-12 rounded-lg border text-base font-medium transition-all",
                                incomeBracket === num
                                    ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                    : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                            )}
                        >
                            {num}구간
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onChange(11)}
                    className={cn(
                        "w-full h-auto py-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1",
                        incomeBracket === 11
                            ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                            : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                    )}
                >
                    <span className="text-base font-medium">잘 모르겠어요.</span>
                    <span className="text-xs opacity-80 font-normal">(선택 시 소득분위 전체에 대한 알림을 받게 돼요)</span>
                </button>
            </div>

            <div className="flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
                    이전
                </Button>
                <Button
                    className="flex-[2] h-12 text-base"
                    disabled={incomeBracket === undefined}
                    onClick={onNext}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
