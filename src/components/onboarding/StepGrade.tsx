'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepGradeProps {
    grade?: number;
    enrollmentStatus?: 'enrolled' | 'on_leave';
    onChange: (data: { grade?: number; enrollment_status?: 'enrolled' | 'on_leave' }) => void;
    onNext: () => void;
    onPrev: () => void;
}

/**
 * StepGrade
 * 학년 및 재학 상태 선택 스텝
 */
export function StepGrade({ grade, enrollmentStatus, onChange, onNext, onPrev }: StepGradeProps) {
    const isValid = grade !== undefined && enrollmentStatus !== undefined;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#212121]">학년과 재학 상태를<br />알려주세요</h2>
                <p className="text-sm text-[#757575]">2026년 신입생은 1학년을 선택해주세요.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-base font-semibold text-[#212121]">학년</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((g) => (
                            <button
                                key={g}
                                onClick={() => onChange({ grade: g, enrollment_status: enrollmentStatus })}
                                className={cn(
                                    "h-14 rounded-lg border text-base font-medium transition-all flex flex-col items-center justify-center",
                                    grade === g
                                        ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                        : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                                )}
                            >
                                <span>{g}학년</span>
                                {g === 1 && <span className="text-[10px] opacity-70">(2026 신입생 포함)</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-base font-semibold text-[#212121]">재학 상태</label>
                        <p className="text-[12px] text-[#757575]">2026년 1학기 기준으로 설정해주세요</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: 'enrolled', label: '재학' },
                            { value: 'on_leave', label: '휴학' }
                        ].map((status) => (
                            <button
                                type="button"
                                key={status.value}
                                onClick={() => onChange({ grade, enrollment_status: status.value as 'enrolled' | 'on_leave' })}
                                className={cn(
                                    "h-12 rounded-lg border text-base font-medium transition-all",
                                    enrollmentStatus === status.value
                                        ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                        : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                                )}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
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
