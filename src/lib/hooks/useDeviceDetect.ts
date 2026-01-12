'use client';

import { useEffect, useState } from 'react';

export function useDeviceDetect() {
    const [device, setDevice] = useState({
        isIOS: false,
        isAndroid: false,
        isSafari: false,
        isStandalone: false,
    });

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isAndroid = /Android/i.test(userAgent);
        const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent) && !/EdgiOS/i.test(userAgent) && !/FxiOS/i.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

        setDevice({ isIOS, isAndroid, isSafari, isStandalone });
    }, []);

    return device;
}
