'use client';

import { useEffect, useState } from 'react';

export function useDeviceDetect() {
    const [device, setDevice] = useState({
        isIOS: false,
        isAndroid: false,
        isSafari: false,
        isStandalone: false,
        isInAppBrowser: false,
    });

    useEffect(() => {
        const userAgent = navigator.userAgent;

        // Android 먼저 체크 (Android User Agent에도 'Safari'가 포함될 수 있음)
        const isAndroid = /Android/i.test(userAgent);

        // iOS는 Android가 아닐 때만 체크
        const isIOS = !isAndroid && /iPhone|iPad|iPod/i.test(userAgent);

        // Safari 체크 (iOS Safari만 해당)
        const isSafari = isIOS && /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent) && !/CriOS/i.test(userAgent);

        // Standalone 모드 (PWA로 설치된 상태)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

        // 인앱 브라우저 감지 (카카오톡, 인스타그램, 페이스북 등)
        const isInAppBrowser = /KAKAOTALK|FBAN|FBAV|Instagram|Line|NAVER|Twitter/i.test(userAgent);

        setDevice({ isIOS, isAndroid, isSafari, isStandalone, isInAppBrowser });
    }, []);

    return device;
}
