'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { departments, REGIONS } from '@/data/departments';
import type { TempUserData, Department } from '@/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'temp_user_data';

/**
 * ProfileEditPage
 * Feature 5: 내 정보 수정 페이지
 * 
 * PRD 기준:
 * - 최초 가입 시 입력한 데이터 수정
 * - PUSH 알림 설정 토글
 */
export default function ProfileEditPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<Partial<TempUserData>>({});
    const [pushEnabled, setPushEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Load user data
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as TempUserData;
                setUserData(parsed);
            } catch (e) {
                console.error("Failed to parse local storage", e);
            }
        }
        setIsLoading(false);
    }, [router]);

    const updateData = (data: Partial<TempUserData>) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const handleSave = () => {
        // Save to localStorage (TODO: Save to DB)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        toast.success('정보가 저장되었습니다.');
        router.push('/home');
    };

    const selectedDept = departments.find(d => d.id === userData.department_id);

    if (isLoading) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                title="내 정보 수정"
                showBack
                onBack={() => router.back()}
                isLoggedIn={true}
            />

            <div className="max-w-md mx-auto px-4 py-6">
                <div className="space-y-6">
                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-base font-semibold text-[#212121]">학과</label>
                        <Select
                            value={userData.department_id}
                            onValueChange={(val) => {
                                const dept = departments.find(d => d.id === val);
                                if (dept) {
                                    updateData({
                                        department_id: dept.id,
                                        department_name: dept.name,
                                        college: dept.college
                                    });
                                }
                            }}
                        >
                            <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="학과 선택">
                                    {selectedDept ? `${selectedDept.college} ${selectedDept.name}` : '학과 선택'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.college} {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Grade */}
                    <div className="space-y-2">
                        <label className="text-base font-semibold text-[#212121]">학년</label>
                        <div className="grid grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => updateData({ grade: g })}
                                    className={cn(
                                        "h-12 rounded-lg border text-base font-medium transition-all",
                                        userData.grade === g
                                            ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                            : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                                    )}
                                >
                                    {g}학년
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Enrollment Status */}
                    <div className="space-y-2">
                        <label className="text-base font-semibold text-[#212121]">재학 상태</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'enrolled', label: '재학' },
                                { value: 'on_leave', label: '휴학' }
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => updateData({ enrollment_status: status.value as 'enrolled' | 'on_leave' })}
                                    className={cn(
                                        "h-12 rounded-lg border text-base font-medium transition-all",
                                        userData.enrollment_status === status.value
                                            ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                            : "border-[#E0E0E0] bg-white text-[#757575] hover:bg-[#F8F9FA]"
                                    )}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GPA */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-base font-semibold text-[#212121]">전체 평균 평점</label>
                            <Input
                                type="number"
                                placeholder="예: 3.85"
                                className="h-12 text-base"
                                step="0.01"
                                max="4.5"
                                min="0"
                                value={userData.avg_gpa ?? ''}
                                onChange={(e) => updateData({ avg_gpa: parseFloat(e.target.value) || undefined })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-base font-semibold text-[#212121]">직전 학기 평점</label>
                            <Input
                                type="number"
                                placeholder="예: 4.0"
                                className="h-12 text-base"
                                step="0.01"
                                max="4.5"
                                min="0"
                                value={userData.prev_semester_gpa ?? ''}
                                onChange={(e) => updateData({ prev_semester_gpa: parseFloat(e.target.value) || undefined })}
                            />
                        </div>
                    </div>

                    {/* Income Bracket */}
                    <div className="space-y-2">
                        <label className="text-base font-semibold text-[#212121]">소득분위</label>
                        <Select
                            value={userData.income_bracket?.toString()}
                            onValueChange={(val) => updateData({ income_bracket: parseInt(val) })}
                        >
                            <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="소득분위 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>{num}구간</SelectItem>
                                ))}
                                <SelectItem value="11">잘 모르겠어요</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Region */}
                    <div className="space-y-2">
                        <label className="text-base font-semibold text-[#212121]">출신 고교 지역</label>
                        <Select
                            value={userData.hometown_region ?? undefined}
                            onValueChange={(val) => updateData({ hometown_region: val })}
                        >
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

                    {/* Push Notification Toggle */}
                    <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                        <div>
                            <p className="font-semibold text-[#212121]">PUSH 알림</p>
                            <p className="text-sm text-[#757575]">새 장학금이 등록되면 알려드려요</p>
                        </div>
                        <button
                            onClick={() => setPushEnabled(!pushEnabled)}
                            className={cn(
                                "w-12 h-7 rounded-full transition-colors relative",
                                pushEnabled ? "bg-[#FF6B35]" : "bg-[#E0E0E0]"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
                                pushEnabled ? "translate-x-5" : "translate-x-0.5"
                            )} />
                        </button>
                    </div>

                    {/* Save Button */}
                    <Button className="w-full h-12 text-base mt-6" onClick={handleSave}>
                        저장하기
                    </Button>
                </div>
            </div>
        </div>
    );
}
