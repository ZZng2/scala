'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getFirebaseAnalytics, logAnalyticsEvent } from '@/lib/firebase';

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Analytics 초기화 시도
        getFirebaseAnalytics();
    }, []);

    useEffect(() => {
        if (pathname) {
            // 페이지 뷰 기록 (GA4는 기본적으로 자동 추적하지만 명시적으로 로그 남김)
            logAnalyticsEvent('page_view', {
                page_path: pathname,
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }, [pathname, searchParams]);

    return null;
}
