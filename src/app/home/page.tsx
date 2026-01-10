'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common';
import { HomeFeed } from '@/components/home';
import { supabase } from '@/lib/supabase/client';
import type { TempUserData } from '@/types';

const STORAGE_KEY = 'temp_user_data';

export default function HomePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<TempUserData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            try {
                // 1. Check Supabase Session
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    setIsLoggedIn(true);

                    // Fetch full profile
                    const { data: profile, error: profileError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .single();

                    const { data: user, error: userError } = await supabase
                        .from('users')
                        .select('admission_year, id')
                        .eq('id', session.user.id)
                        .single();

                    if (profile && user) {
                        // Map to TempUserData structure for compatibility with HomeFeed
                        const mappedData: TempUserData = {
                            department_id: profile.department_id || '',
                            department_name: profile.department_name || '',
                            college: profile.college || '',
                            grade: profile.grade || 1,
                            avg_gpa: profile.avg_gpa,
                            prev_semester_gpa: profile.prev_semester_gpa,
                            income_bracket: profile.income_bracket || 0,
                            hometown_region: profile.hometown_region,
                            enrollment_status: (profile.enrollment_status as any) || 'enrolled',
                            has_disability: profile.has_disability || false,
                            is_multi_child_family: profile.is_multi_child_family || false,
                            is_national_merit: profile.is_national_merit || false,
                            admission_year: user.admission_year || undefined
                        };
                        setUserData(mappedData);
                    } else {
                        // Logged in but no profile data? Redirect to onboarding
                        console.warn('Logged in but no profile found, redirecting to onboarding');
                        router.replace('/onboarding');
                        return;
                    }
                } else {
                    // 2. No Session -> Check Local Storage
                    const saved = localStorage.getItem(STORAGE_KEY);
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved) as TempUserData;
                            setUserData(parsed);
                        } catch (e) {
                            console.error("Failed to parse local storage", e);
                            router.replace('/onboarding');
                            return;
                        }
                    } else {
                        // 3. No Session & No Local Data -> Landing
                        router.replace('/landing');
                        return;
                    }
                }
            } catch (error) {
                console.error('Error in HomePage auth check:', error);
                router.replace('/landing');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoad();
    }, [router]);

    const handleReset = async () => {
        if (isLoggedIn) {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
        }
        localStorage.removeItem(STORAGE_KEY);
        router.push('/landing'); // Reset should probably go to landing or onboarding
    };

    if (isLoading || !userData) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
            </div>
        );
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
