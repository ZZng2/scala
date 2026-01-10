'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
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
 * - 완료 시 /home으로 이동 (로그인 사용자면 DB 저장)
 */
export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1-5: Form, 6: Loading
    const [userData, setUserData] = useState<Partial<TempUserData>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * DB에 프로필 정보를 저장하고 온보딩 완료 상태로 변경하는 공통 함수
     */
    const saveToSupabase = async (data: Partial<TempUserData>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // 1. Save profile
            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert({
                    user_id: user.id,
                    department_id: data.department_id,
                    department_name: data.department_name,
                    college: data.college,
                    grade: data.grade,
                    enrollment_status: data.enrollment_status,
                    avg_gpa: data.avg_gpa,
                    prev_semester_gpa: data.prev_semester_gpa,
                    income_bracket: data.income_bracket,
                    hometown_region: data.hometown_region,
                    has_disability: data.has_disability,
                    is_multi_child_family: data.is_multi_child_family,
                    is_national_merit: data.is_national_merit
                });

            if (profileError) throw profileError;

            // 2. Mark onboarding as completed and save additional user fields
            const { error: userError } = await supabase
                .from('users')
                .update({
                    onboarding_completed: true,
                    admission_year: data.admission_year
                })
                .eq('id', user.id);

            if (userError) throw userError;

            // 3. Clear local storage upon success
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error('Failed to save onboarding data:', err);
            throw err;
        }
    };

    // Load from local storage on mount and check for auto-sync
    useEffect(() => {
        const checkAuthAndSync = async () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            let parsed: Partial<TempUserData> = {};

            if (saved) {
                try {
                    parsed = JSON.parse(saved);
                    setUserData(parsed);
                } catch (e) {
                    console.error("Failed to parse local storage", e);
                }
            }

            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();

            if (user && Object.keys(parsed).length > 0) {
                const { data: userRecord } = await supabase
                    .from('users')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                // 온보딩이 아직 완료되지 않았고 임시 데이터가 있다면 자동 동기화
                if (userRecord && !userRecord.onboarding_completed) {
                    setStep(6); // Show loading screen
                    try {
                        await saveToSupabase(parsed);
                        // 동기화 성공 시 즉시 홈 화면으로 리다이렉트
                        router.push('/home');
                        return; // 더 이상 진행하지 않음
                    } catch (err) {
                        console.error('Auto-sync failed:', err);
                        setStep(1); // Fail -> manual
                    }
                }
            }

            setIsLoaded(true);
        };

        checkAuthAndSync();
    }, []);

    // Save to local storage on change (only if not finished)
    useEffect(() => {
        if (isLoaded && step < 6 && Object.keys(userData).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        }
    }, [userData, isLoaded, step]);

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

    /**
     * 최종 완료 처리
     */
    const handleFinish = async () => {
        setStep(6); // Go to loading

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            try {
                await saveToSupabase(userData);
            } catch (err) {
                alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
                setStep(5);
            }
        }
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
                            admissionYear={userData.admission_year}
                            onChange={handleDepartmentChange}
                            onAdmissionYearChange={(year) => updateData({ admission_year: year })}
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
                            admissionYear={userData.admission_year}
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
