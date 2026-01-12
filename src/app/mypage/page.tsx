'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

/**
 * MyPage
 * Feature 5: 내 정보 수정
 */
export default function MyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        department_name: '',
        grade: '1',
        enrollment_status: 'enrolled',
        avg_gpa: '',
        prev_semester_gpa: '',
        income_bracket: '',
        hometown_region: '',
        has_disability: false,
        is_multi_child_family: false,
        is_national_merit: false,
    });
    const [pushEnabled, setPushEnabled] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                // 1. Check Auth
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.replace('/login');
                    return;
                }
                setUserId(user.id);

                // 2. Fetch Profile
                const { data: profile, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (error) throw error;

                if (profile) {
                    setFormData({
                        department_name: profile.department_name || '',
                        grade: String(profile.grade || '1'),
                        enrollment_status: profile.enrollment_status || 'enrolled',
                        avg_gpa: profile.avg_gpa?.toString() || '',
                        prev_semester_gpa: profile.prev_semester_gpa?.toString() || '',
                        income_bracket: profile.income_bracket?.toString() || '',
                        hometown_region: profile.hometown_region || '',
                        has_disability: profile.has_disability || false,
                        is_multi_child_family: profile.is_multi_child_family || false,
                        is_national_merit: profile.is_national_merit || false,
                    });
                }

                // 3. Fetch Push Settings from users table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('push_enabled')
                    .eq('id', user.id)
                    .single();

                if (!userError && userData) {
                    setPushEnabled(userData.push_enabled ?? true);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('프로필 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsSaving(true);
        try {
            // 1. Update Profile
            const payload = {
                user_id: userId,
                department_name: formData.department_name,
                grade: parseInt(formData.grade),
                enrollment_status: formData.enrollment_status,
                avg_gpa: formData.avg_gpa ? parseFloat(formData.avg_gpa) : null,
                prev_semester_gpa: formData.prev_semester_gpa ? parseFloat(formData.prev_semester_gpa) : null,
                income_bracket: formData.income_bracket ? parseInt(formData.income_bracket) : null,
                hometown_region: formData.hometown_region || null,
                has_disability: formData.has_disability,
                is_multi_child_family: formData.is_multi_child_family,
                is_national_merit: formData.is_national_merit,
                updated_at: new Date().toISOString(),
            };

            const { error: profileError } = await supabase
                .from('user_profiles')
                .upsert(payload, { onConflict: 'user_id' });

            if (profileError) throw profileError;

            // 2. Update Push Settings (users table)
            const { error: userError } = await supabase
                .from('users')
                .update({ push_enabled: pushEnabled })
                .eq('id', userId);

            if (userError) throw userError;

            toast.success('저장되었습니다.', {
                description: '정보가 성공적으로 갱신되었습니다.'
            });
            router.refresh();

        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Header
                title="내 정보 수정"
                showBack
                onBack={() => router.back()}
                isLoggedIn={true}
            />

            <main className="max-w-md mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 학적 정보 */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-[#212121]">학적 정보</h3>

                        <div className="space-y-2">
                            <Label htmlFor="department_name">학과</Label>
                            <Input
                                id="department_name"
                                name="department_name"
                                value={formData.department_name}
                                onChange={handleChange}
                                placeholder="예: 컴퓨터공학과"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>학년</Label>
                                <Select
                                    value={formData.grade}
                                    onValueChange={(val) => handleSelectChange('grade', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="학년" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1학년</SelectItem>
                                        <SelectItem value="2">2학년</SelectItem>
                                        <SelectItem value="3">3학년</SelectItem>
                                        <SelectItem value="4">4학년</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>재학 상태</Label>
                                <Select
                                    value={formData.enrollment_status}
                                    onValueChange={(val) => handleSelectChange('enrollment_status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="상태" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="enrolled">재학</SelectItem>
                                        <SelectItem value="on_leave">휴학</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* 성적 및 소득 */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-[#212121]">성적 및 소득</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="avg_gpa">전체 평점 (4.5)</Label>
                                <Input
                                    id="avg_gpa"
                                    name="avg_gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.5"
                                    value={formData.avg_gpa}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prev_semester_gpa">직전 학기 (4.5)</Label>
                                <Input
                                    id="prev_semester_gpa"
                                    name="prev_semester_gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4.5"
                                    value={formData.prev_semester_gpa}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>소득분위</Label>
                            <Select
                                value={formData.income_bracket}
                                onValueChange={(val) => handleSelectChange('income_bracket', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="소득분위 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">0구간 (기초수급/차상위)</SelectItem>
                                    <SelectItem value="1">1구간</SelectItem>
                                    <SelectItem value="2">2구간</SelectItem>
                                    <SelectItem value="3">3구간</SelectItem>
                                    <SelectItem value="4">4구간</SelectItem>
                                    <SelectItem value="5">5구간</SelectItem>
                                    <SelectItem value="6">6구간</SelectItem>
                                    <SelectItem value="7">7구간</SelectItem>
                                    <SelectItem value="8">8구간</SelectItem>
                                    <SelectItem value="9">9구간</SelectItem>
                                    <SelectItem value="10">10구간</SelectItem>
                                    <SelectItem value="11">미해당</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>거주 지역</Label>
                            <Select
                                value={formData.hometown_region}
                                onValueChange={(val) => handleSelectChange('hometown_region', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="지역 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seoul">서울</SelectItem>
                                    <SelectItem value="gyeonggi">경기/인천</SelectItem>
                                    <SelectItem value="gangwon">강원</SelectItem>
                                    <SelectItem value="chungcheong">충청/대전/세종</SelectItem>
                                    <SelectItem value="jeolla">전라/광주</SelectItem>
                                    <SelectItem value="gyeongsang">경상/대구/부산/울산</SelectItem>
                                    <SelectItem value="jeju">제주</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                </Select>
        </div>
                    </section >

        {/* Push Notification Toggle */ }
        < div className = "flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg" >
                        <div>
                            <p className="font-semibold text-[#212121]">PUSH 알림</p>
                            <p className="text-sm text-[#757575]">새 장학금이 등록되면 알려드려요</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPushEnabled(!pushEnabled)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${pushEnabled ? "bg-[#FF6B35]" : "bg-[#E0E0E0]"}`}
                        >
                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${pushEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div >

        {/* 추가 자격 */ }
        < section className = "space-y-4" >
                        <h3 className="text-lg font-bold text-[#212121]">추가 자격</h3>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="has_disability"
                                    name="has_disability"
                                    checked={formData.has_disability}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                />
                                <Label htmlFor="has_disability" className="font-normal cursor-pointer">장애인 등록 여부</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_multi_child_family"
                                    name="is_multi_child_family"
                                    checked={formData.is_multi_child_family}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                />
                                <Label htmlFor="is_multi_child_family" className="font-normal cursor-pointer">다자녀 가구 해당하는가</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_national_merit"
                                    name="is_national_merit"
                                    checked={formData.is_national_merit}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                />
                                <Label htmlFor="is_national_merit" className="font-normal cursor-pointer">국가유공자 본인/자녀</Label>
                            </div>
                        </div>
                    </section >

        <Button type="submit" className="w-full h-12 text-lg font-bold mt-8" disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장하기'}
        </Button>
                </form >
            </main >
        </div >
    );
}
