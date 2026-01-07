'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import {
    ProgressBar,
    StepDepartment,
    StepGrade,
    StepGPA,
    StepIncome,
    StepRegion,
    LoadingScreen,
} from '@/components/onboarding';
import { Department, TempUserData } from '@/types';

const STORAGE_KEY = 'temp_user_data';

/**
 * OnboardingPage
 * Feature 1: 데이터 입력 & Lazy Registration
 * 
 * PRD 기준:
 * - 5단계 폼 (학과, 학년, GPA, 소득분위, 거주지)
 * - localStorage 임시 저장
 * - 완료 시 /home으로 이동
 */
export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1-5: Form, 6: Loading
    const [userData, setUserData] = useState<Partial<TempUserData>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUserData(parsed);
            } catch (e) {
                console.error("Failed to parse local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded && Object.keys(userData).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        }
    }, [userData, isLoaded]);

    const updateData = (data: Partial<TempUserData>) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleDepartmentChange = (dept: Department) => {
        updateData({
            department_id: dept.id,
            department_name: dept.name,
            college: dept.college
        });
    };

    const handleFinish = () => {
        setStep(6); // Go to loading
    };

    const handleLoadingComplete = useCallback(() => {
        router.push('/home');
    }, [router]);

    // Loading Screen
    if (step === 6) {
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }

    // Don't render until localStorage is loaded
    if (!isLoaded) {
        return <div className="min-h-screen bg-white" />;
    }

    // Form Steps
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <div className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col">
                <ProgressBar currentStep={step} totalSteps={5} />

                <div className="flex-1 flex flex-col">
                    {step === 1 && (
                        <StepDepartment
                            value={userData.department_id ? {
                                id: userData.department_id,
                                name: userData.department_name!,
                                college: userData.college!
                            } : undefined}
                            onChange={handleDepartmentChange}
                            onNext={nextStep}
                        />
                    )}
                    {step === 2 && (
                        <StepGrade
                            grade={userData.grade}
                            enrollmentStatus={userData.enrollment_status}
                            onChange={updateData}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}
                    {step === 3 && (
                        <StepGPA
                            avgGpa={userData.avg_gpa ?? undefined}
                            prevSemesterGpa={userData.prev_semester_gpa ?? undefined}
                            onChange={updateData}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}
                    {step === 4 && (
                        <StepIncome
                            incomeBracket={userData.income_bracket}
                            onChange={(val) => updateData({ income_bracket: val })}
                            onNext={nextStep}
                            onPrev={prevStep}
                        />
                    )}
                    {step === 5 && (
                        <StepRegion
                            region={userData.hometown_region ?? undefined}
                            hasDisability={userData.has_disability || false}
                            isMultiChild={userData.is_multi_child_family || false}
                            isNationalMerit={userData.is_national_merit || false}
                            onChange={updateData}
                            onSubmit={handleFinish}
                            onPrev={prevStep}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
