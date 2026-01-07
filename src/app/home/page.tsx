'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import { HomeFeed } from '@/components/home';
import type { TempUserData } from '@/types';

const STORAGE_KEY = 'temp_user_data';

/**
 * HomePage
 * Feature 2: 개인화된 장학금 홈 피드
 * 
 * PRD 기준:
 * - localStorage에서 사용자 데이터 로드
 * - 비회원: StickyBar 표시
 * - 장학금 리스트 D-Day 순 정렬
 */
export default function HomePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<TempUserData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth token
        const token = localStorage.getItem('auth_token');
        setIsLoggedIn(!!token);

        // Load user data
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as TempUserData;
                setUserData(parsed);
            } catch (e) {
                console.error("Failed to parse local storage", e);
                // No data, redirect to onboarding
                router.push('/onboarding');
                return;
            }
        } else {
            // No data, redirect to onboarding or landing
            router.push('/landing');
            return;
        }

        setIsLoading(false);
    }, [router]);

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        router.push('/onboarding');
    };

    if (isLoading || !userData) {
        return <div className="min-h-screen bg-[#F8F9FA]" />;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header isLoggedIn={isLoggedIn} showLogo={false} />
            <HomeFeed
                userData={userData}
                isLoggedIn={isLoggedIn}
                onReset={handleReset}
            />
        </div>
    );
}
