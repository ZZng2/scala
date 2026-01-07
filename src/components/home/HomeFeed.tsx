'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCcw } from 'lucide-react';
import { ScholarshipCard } from '@/components/common';
import { StickyBar } from '@/components/common';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import type { ScholarshipCardData, TempUserData } from '@/types';

interface HomeFeedProps {
    userData: TempUserData;
    isLoggedIn: boolean;
    onReset?: () => void;
}

/**
 * HomeFeed
 * Feature 2: 개인화된 장학금 홈 피드
 * 
 * PRD 기준:
 * - D-Day 순 정렬
 * - 비회원: StickyBar 표시
 * - EmptyState 처리
 */
export function HomeFeed({ userData, isLoggedIn, onReset }: HomeFeedProps) {
    const [scholarships, setScholarships] = useState<ScholarshipCardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                // Fetch actual data from Supabase
                const { data, error } = await supabase
                    .from('scholarships')
                    .select('*'); // 필요한 경우 필터링 추가 가능

                if (error) throw error;

                if (data) {
                    const today = new Date();
                    const processed = data
                        .map(s => {
                            const deadline = new Date(s.deadline);
                            const diffTime = deadline.getTime() - today.getTime();
                            const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            // ScholarshipCardData 타입에 맞게 변환
                            return {
                                ...s,
                                d_day: dDay,
                                amount_text: s.amount_text || '', // null 처리
                                is_scrapped: false, // 기본값, 필요 시 별도 로직으로 scrap 여부 조회
                            } as ScholarshipCardData;
                        })
                        .sort((a, b) => a.d_day - b.d_day);

                    setScholarships(processed);
                }
            } catch (error) {
                console.error('Failed to fetch scholarships:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarships();
    }, [userData]);

    if (loading) {
        return <div className="min-h-screen bg-[#F8F9FA]" />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24">
            {/* Header Summary */}
            <div className="bg-[#FF6B35]/10 p-6 pb-12 rounded-b-[2rem]">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-2 text-[#212121]">
                        {userData.department_name} {userData.grade}학년을 위한<br />
                        장학금이 <span className="text-[#FF6B35]">{scholarships.length}개</span> 있어요!
                    </h1>
                    <p className="text-[#757575] text-sm mb-4">
                        입력하신 조건(소득 {userData.income_bracket === 11 ? '미지정' : `${userData.income_bracket}구간`}, {userData.avg_gpa}점)에 맞춰 찾았습니다.
                    </p>
                </div>
            </div>

            {/* Scholarship List */}
            <div className="max-w-md mx-auto px-4 -mt-8 space-y-4 mb-20">
                {scholarships.length > 0 ? (
                    scholarships.map(s => (
                        <ScholarshipCard key={s.id} scholarship={s} />
                    ))
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E0E0E0] mt-4">
                        <div className="bg-[#FF6B35]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-[#212121]">조건에 딱 맞는 공고가 아직 없어요.</h3>
                        <p className="text-[#757575] text-sm mb-6">
                            하지만 내일 당장 올라올 수도 있어요.<br />
                            스칼라가 매일 지켜보다가 뜨면 바로 알려드릴까요?
                        </p>
                        <Button asChild className="w-full font-bold">
                            <Link href="/signup">
                                3초 만에 알림 예약하기
                            </Link>
                        </Button>
                        <p className="text-xs text-[#757575] mt-2">카카오로 간편하게 시작</p>
                    </div>
                )}

                {scholarships.length > 0 && onReset && (
                    <div className="pt-8 pb-4 text-center">
                        <Button variant="outline" onClick={onReset} className="gap-2">
                            <RefreshCcw className="w-4 h-4" />
                            조건 다시 입력하기
                        </Button>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar for Sign Up Conversion - Only for Guests */}
            {!isLoggedIn && <StickyBar />}
        </div>
    );
}
