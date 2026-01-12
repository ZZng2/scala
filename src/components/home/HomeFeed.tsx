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
                // 1. match_scholarships RPC 호출 시도 (개인화 필터링)
                const { data, error } = await supabase.rpc('match_scholarships', {
                    p_grade: userData.grade,
                    p_gpa: userData.avg_gpa ?? 0, // null인 경우 0으로 처리
                    // 소득분위 11(미해당)은 0으로 전달하여 제한 없음으로 처리
                    p_income_bracket: userData.income_bracket === 11 ? 0 : userData.income_bracket,
                    p_department_id: userData.department_id,
                    p_region: userData.hometown_region ?? '', // null인 경우 빈 문자열로 처리
                    p_has_disability: userData.has_disability || false,
                    p_is_multi_child: userData.is_multi_child_family || false,
                    p_is_national_merit: userData.is_national_merit || false,
                });

                let processedData = data;

                // 2. RPC 실패 시 Fallback: 전체 조회 후 클라이언트 사이드 필터링
                if (error) {
                    console.error('RPC failed, falling back to client-side filtering:', error);
                    const { data: allData, error: fetchError } = await supabase
                        .from('scholarships')
                        .select('*')
                        .eq('is_closed', false);

                    if (fetchError) throw fetchError;

                    // matching API logic과 동일한 필터링 적용
                    processedData = (allData || []).filter((s: any) => {
                        // 소득분위 (null이면 제한 없음, 11이면 사용자 미지정)
                        if (s.max_income_bracket !== null && userData.income_bracket !== 11) {
                            if (userData.income_bracket > s.max_income_bracket) return false;
                        }
                        // 성적
                        if (s.min_gpa !== null && userData.avg_gpa !== null) {
                            if (userData.avg_gpa < s.min_gpa) return false;
                        }
                        // 학년
                        if (s.target_grades && s.target_grades.length > 0 && userData.grade) {
                            if (!s.target_grades.includes(userData.grade)) return false;
                        }
                        // 특수 조건
                        if (s.requires_disability && !userData.has_disability) return false;
                        if (s.requires_multi_child && !userData.is_multi_child_family) return false;
                        if (s.requires_national_merit && !userData.is_national_merit) return false;

                        return true;
                    });
                }

                if (processedData) {
                    const today = new Date();
                    const processed = (processedData as any[])
                        .map(s => {
                            let dDay = 0;
                            if (s.deadline) {
                                const deadlineDate = new Date(s.deadline);
                                const diffTime = deadlineDate.getTime() - today.getTime();
                                dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            }

                            return {
                                ...s,
                                d_day: dDay,
                                is_closed: s.is_closed ?? false,
                                amount_text: s.amount_text || '',
                                is_scrapped: false,
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
                        입력하신 조건(소득 {userData.income_bracket === 11 ? '미지정' : `${userData.income_bracket}구간`}, {userData.avg_gpa === 0 ? '2026학번 새내기' : `${userData.avg_gpa}점`})에 맞춰 찾았습니다.
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
                    /* Empty State - 로그인 상태에 따라 다른 메시지 표시 */
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E0E0E0] mt-4">
                        <div className="bg-[#FF6B35]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-[#212121]">조건에 딱 맞는 공고가 아직 없어요.</h3>

                        {isLoggedIn ? (
                            /* 로그인 상태: 간단한 위로 메시지만 표시 */
                            <p className="text-[#757575] text-sm">
                                업데이트 되면 바로 알려드릴게요!
                            </p>
                        ) : (
                            /* 비로그인 상태: 기존 위로 문구 + CTA */
                            <>
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
                            </>
                        )}
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
