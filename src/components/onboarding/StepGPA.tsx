'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StepGPAProps {
    avgGpa?: number;
    prevSemesterGpa?: number;
    admissionYear?: number;
    onChange: (data: { avg_gpa?: number; prev_semester_gpa?: number }) => void;
    onNext: () => void;
    onPrev: () => void;
}

/**
 * StepGPA
 * 평점 입력 스텝
 */
export function StepGPA({ avgGpa, prevSemesterGpa, admissionYear, onChange, onNext, onPrev }: StepGPAProps) {
    const isFreshman = admissionYear === 2026;
    const [avgStr, setAvgStr] = useState(avgGpa?.toString() ?? (isFreshman ? '0' : ''));
    const [prevStr, setPrevStr] = useState(prevSemesterGpa?.toString() ?? (isFreshman ? '0' : ''));

    const isValid = isFreshman || (avgGpa !== undefined && prevSemesterGpa !== undefined);

    const handleInputChange = (field: 'avgGpa' | 'prevSemesterGpa', value: string) => {
        if (value && parseFloat(value) > 4.5) return;

        if (field === 'avgGpa') {
            setAvgStr(value);
            const val = parseFloat(value);
            onChange({ avg_gpa: isNaN(val) ? undefined : val, prev_semester_gpa: prevSemesterGpa });
        } else {
            setPrevStr(value);
            const val = parseFloat(value);
            onChange({ avg_gpa: avgGpa, prev_semester_gpa: isNaN(val) ? undefined : val });
        }
    };

    const handleNext = () => {
        if (isFreshman) {
            onChange({ avg_gpa: 0, prev_semester_gpa: 0 });
        }
        onNext();
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#212121]">학점을 입력해주세요</h2>
                {isFreshman ? (
                    <p className="text-[#FF6B35] font-medium">2026년 새내기는 학점 정보가 없으므로 0점으로 처리됩니다.</p>
                ) : (
                    <p className="text-[#757575]">4.5 만점 기준으로 입력해주세요.</p>
                )}
            </div>

            <div className={cn("space-y-6", isFreshman && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                    <label className="text-base font-semibold text-[#212121]">전체 평균 평점 (총 평점)</label>
                    <Input
                        type="number"
                        placeholder={isFreshman ? "0" : "예: 3.85"}
                        className="h-12 text-lg"
                        step="0.01"
                        max="4.5"
                        min="0"
                        value={avgStr}
                        onChange={(e) => !isFreshman && handleInputChange('avgGpa', e.target.value)}
                        readOnly={isFreshman}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-base font-semibold text-[#212121]">직전 학기 평점</label>
                    <Input
                        type="number"
                        placeholder={isFreshman ? "0" : "예: 4.0"}
                        className="h-12 text-lg"
                        step="0.01"
                        max="4.5"
                        min="0"
                        value={prevStr}
                        onChange={(e) => !isFreshman && handleInputChange('prevSemesterGpa', e.target.value)}
                        readOnly={isFreshman}
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-auto">
                <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
                    이전
                </Button>
                <Button
                    className="flex-[2] h-12 text-base"
                    disabled={!isValid}
                    onClick={handleNext}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
