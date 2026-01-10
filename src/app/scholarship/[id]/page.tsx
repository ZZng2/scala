'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import { DetailHeader, DetailContent, DetailStickyActionBar } from '@/components/scholarship';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type Scholarship = Database['public']['Tables']['scholarships']['Row'] & {
    d_day?: number;
};

/**
 * ScholarshipDetailPage
 * Feature 3: 장학금 상세 & 스크랩
 */
export default function ScholarshipDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrapped, setIsScrapped] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Check Auth (User ID)
                const { data: { user } } = await supabase.auth.getUser();
                setUserId(user?.id || null);

                // 2. Validate ID (UUID check)
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                if (!uuidRegex.test(id)) {
                    console.warn(`Invalid UUID format: ${id}`);
                    throw new Error('Invalid ID format');
                }

                // 3. Fetch Scholarship Detail
                const { data: scholarshipData, error: scholarshipError } = await supabase
                    .from('scholarships')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(); // single() 대신 maybeSingle() 사용하여 0개일 때 에러 방지

                if (scholarshipError) throw scholarshipError;
                if (!scholarshipData) throw new Error('Scholarship not found');

                // 3. Check Scrap Status (if logged in)
                let scrapped = false;
                if (user) {
                    const { data: scrapData } = await supabase
                        .from('scraps')
                        .select('*')
                        .eq('scholarship_id', id)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (scrapData) scrapped = true;
                }

                // 4. Calculate D-Day
                const today = new Date();
                let dDay = 0;
                if (scholarshipData.deadline) {
                    const deadlineDate = new Date(scholarshipData.deadline);
                    const diffTime = deadlineDate.getTime() - today.getTime();
                    dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }

                setScholarship({
                    ...scholarshipData,
                    d_day: dDay
                });
                setIsScrapped(scrapped);

                // 5. Increment View Count (Optimistic or Fire-and-forget)
                // API Route에서 처리하는게 더 안전하지만 클라이언트에서 호출했으므로 RPC 호출 시도
                /* 
                // @ts-ignore
            supabase.rpc('increment_views', { scholarship_id: id }).then(({ error }) => {
                   if (error) console.error('Failed to increment view:', error);
                });
                */

            } catch (error) {
                console.error('Error fetching details:', error);
                // 에러 발생 시 처리 (예: 404 페이지로 이동 또는 에러 메시지)
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleScrapToggle = async (nextScrapState: boolean) => {
        if (!userId) {
            // 비로그인 상태 처리: 로그인 페이지로 이동 유도
            if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
                // 현재 URL을 리다이렉트 파라미터로 넘겨주면 좋음 (나중에 구현)
                router.push('/login'); // 혹은 랜딩 페이지
            }
            return;
        }

        // Optimistic UI Update
        const previousState = isScrapped;
        setIsScrapped(nextScrapState);

        try {
            if (nextScrapState) {
                // Insert Scrap
                const { error } = await supabase
                    .from('scraps')
                    .insert({ user_id: userId, scholarship_id: id });

                if (error) throw error;
                // alert('찜 목록에 추가되었습니다.'); // 너무 방해되므로 생략하거나 토스트 사용
            } else {
                // Delete Scrap
                const { error } = await supabase
                    .from('scraps')
                    .delete()
                    .eq('user_id', userId)
                    .eq('scholarship_id', id);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Scrap toggle error:', error);
            setIsScrapped(previousState); // Revert on error
            alert('찜하기 처리에 실패했습니다. 다시 시도해주세요.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    if (!scholarship) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#757575] mb-4">장학금 정보를 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/home')}
                        className="text-[#FF6B35] font-medium"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // DetailHeader, DetailStickyActionBar에 전달할 때 타입 호환성 주의
    // 여기서는 Supabase 타입 그대로 사용하되 필요한 prop만 전달됨을 가정
    return (
        <div className="min-h-screen bg-white pb-20">
            <Header
                title="장학금 상세"
                showBack
                onBack={() => router.back()}
            />
            <DetailHeader scholarship={scholarship as any} />
            <DetailContent scholarship={scholarship as any} />
            <DetailStickyActionBar
                scholarship={scholarship as any}
                isScrapped={isScrapped} // Sticky Bar가 isScrapped prop을 받아야 함 (확인 필요)
                onScrapToggle={handleScrapToggle}
            />
        </div>
    );
}
