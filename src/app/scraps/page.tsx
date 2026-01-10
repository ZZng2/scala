'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header, ScholarshipCard } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import type { ScholarshipCardData } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

/**
 * ScrapsPage
 * Feature 5: 찜 목록 페이지
 */
export default function ScrapsPage() {
    const router = useRouter();
    const [scraps, setScraps] = useState<ScholarshipCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchScraps = async () => {
            setIsLoading(true);
            try {
                // Check Auth
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.replace('/login');
                    return;
                }
                setUserId(user.id);

                // Load scraps
                // select query: scrap 조인 scholarship
                const { data, error } = await supabase
                    .from('scraps')
                    .select(`
                        scholarship_id,
                        scholarships (
                            *
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Transform to Card Data
                const formattedData: ScholarshipCardData[] = data.map((item: any) => {
                    const s = item.scholarships;

                    // D-Day calc
                    const today = new Date();
                    let d_day = 0;
                    if (s.deadline) {
                        const deadlineDate = new Date(s.deadline);
                        const diffTime = deadlineDate.getTime() - today.getTime();
                        d_day = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }

                    return {
                        id: s.id,
                        title: s.title,
                        category: s.category,
                        amount_text: s.amount_text || '금액 미정',
                        deadline: s.deadline,
                        d_day: d_day,
                        is_closed: s.is_closed,
                        is_scrapped: true
                    };
                });

                // 마감된 공고 후순위 정렬 등 필요하다면 추가 정렬
                setScraps(formattedData);

            } catch (error) {
                console.error('Error fetching scraps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScraps();
    }, [router]);

    const handleScrapToggle = async (id: string, isScrapped: boolean) => {
        if (!userId) return;

        // Optimistic Update
        const targetId = id;

        // 목록에서 제거
        if (!isScrapped) {
            setScraps(prev => prev.filter(s => s.id !== targetId));

            // DB Delete
            const { error } = await supabase
                .from('scraps')
                .delete()
                .eq('user_id', userId)
                .eq('scholarship_id', targetId);

            if (error) {
                console.error('Failed to remove scrap:', error);
                // 복구 로직이 필요할 수 있으나 생략 (재조회 등)
                alert('삭제 실패. 다시 시도해주세요.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="w-full max-w-sm h-32 bg-gray-200 rounded-xl mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* 찜 목록에서는 isLoggedIn 체크하지 않아도 내부에서 체크/리다이렉트하므로 true 전달해도 무방 */}
            <Header
                title="찜 목록"
                showBack
                onBack={() => router.back()}
                isLoggedIn={true}
            />

            <div className="max-w-md mx-auto px-4 py-6 pb-20">
                {scraps.length > 0 ? (
                    <div className="space-y-4">
                        {scraps.map(scholarship => (
                            <ScholarshipCard
                                key={scholarship.id}
                                scholarship={scholarship}
                                showScrapButton
                                onScrapToggle={handleScrapToggle}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E0E0E0] mt-4">
                        <div className="bg-[#FF6B35]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bookmark className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-[#212121]">
                            아직 찜한 장학금이 없어요
                        </h3>
                        <p className="text-[#757575] text-sm mb-6">
                            관심 있는 장학금을 찜해두면<br />
                            여기서 한눈에 볼 수 있어요.
                        </p>
                        <Button asChild className="w-full font-bold">
                            <Link href="/home">
                                찜하러 가기
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
