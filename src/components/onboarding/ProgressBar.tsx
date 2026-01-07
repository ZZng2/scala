'use client';

import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

/**
 * ProgressBar
 * 온보딩 진행 상태 표시 바
 * 
 * PRD 기준:
 * - 상단에 진행 바 (Step 1/5 형태)
 * - 오렌지색 Fill
 */
export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full bg-[#F8F9FA] h-1 mb-8">
            <div
                className="bg-[#FF6B35] h-1 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
