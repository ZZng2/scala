'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepGPAProps {
    avgGpa?: number;
    prevSemesterGpa?: number;
    onChange: (data: { avg_gpa?: number; prev_semester_gpa?: number }) => void;
    onNext: () => void;
    onPrev: () => void;
}

/**
 * StepGPA
 * 평점 입력 스텝
 * 
 * PRD 기준:
 * - 전체 평균 평점 (총 평점)
 * - 직전 학기 평점
 * - 4.5 만점 기준
 */
export function StepGPA({ avgGpa, prevSemesterGpa, onChange, onNext, onPrev }: StepGPAProps) {
    const [avgStr, setAvgStr] = useState(avgGpa?.toString() ?? '');
    const [prevStr, setPrevStr] = useState(prevSemesterGpa?.toString() ?? '');

    useEffect(() => {
        if (avgGpa === undefined) {
            if (avgStr !== '') setAvgStr('');
        } else if (avgGpa !== parseFloat(avgStr)) {
            setAvgStr(avgGpa.toString());
        }
    }, [avgGpa]);

    useEffect(() => {
        if (prevSemesterGpa === undefined) {
            if (prevStr !== '') setPrevStr('');
        } else if (prevSemesterGpa !== parseFloat(prevStr)) {
            setPrevStr(prevSemesterGpa.toString());
        }
    }, [prevSemesterGpa]);

    const isValid = avgGpa !== undefined && prevSemesterGpa !== undefined;

    const handleInputChange = (field: 'avgGpa' | 'prevSemesterGpa', value: string) => {
        if (field === 'avgGpa') setAvgStr(value);
        else setPrevStr(value);

        const num = parseFloat(value);

        if (value === '') {
            onChange({
                avg_gpa: field === 'avgGpa' ? undefined : avgGpa,
                prev_semester_gpa: field === 'prevSemesterGpa' ? undefined : prevSemesterGpa
            });
            return;
        }

        if (!isNaN(num) && num >= 0 && num <= 4.5) {
            onChange({
                avg_gpa: field === 'avgGpa' ? num : avgGpa,
                prev_semester_gpa: field === 'prevSemesterGpa' ? num : prevSemesterGpa
            });
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#212121]">학점을 입력해주세요</h2>
                <p className="text-[#757575]">4.5 만점 기준으로 입력해주세요.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-base font-semibold text-[#212121]">전체 평균 평점 (총 평점)</label>
                    <Input
                        type="number"
                        placeholder="예: 3.85"
                        className="h-12 text-lg"
                        step="0.01"
                        max="4.5"
                        min="0"
                        value={avgStr}
                        onChange={(e) => handleInputChange('avgGpa', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-base font-semibold text-[#212121]">직전 학기 평점</label>
                    <Input
                        type="number"
                        placeholder="예: 4.0"
                        className="h-12 text-lg"
                        step="0.01"
                        max="4.5"
                        min="0"
                        value={prevStr}
                        onChange={(e) => handleInputChange('prevSemesterGpa', e.target.value)}
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
                    onClick={onNext}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
