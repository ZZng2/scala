'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDeviceDetect } from '@/lib/hooks/useDeviceDetect';
import { PushPermissionModal } from './PushPermissionModal';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';
import { IOSPushPermissionModal } from './IOSPushPermissionModal';

function PostSignupFlowInternal() {
    const searchParams = useSearchParams();
    const { isIOS, isAndroid, isStandalone } = useDeviceDetect();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const postSignup = searchParams.get('postSignup');

        if (postSignup) {
            setShowModal(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setShowModal(false);
        // URL에서 쿼리 파라미터 제거하여 다시 발생하지 않도록 함
        const url = new URL(window.location.href);
        url.searchParams.delete('postSignup');
        window.history.replaceState({}, '', url.pathname + url.search);
    };

    if (!showModal) return null;

    // Android: 즉시 알림 권한 요청 (PRD Feature 4 - Case 1)
    if (isAndroid) {
        return <PushPermissionModal open={showModal} onClose={handleClose} />;
    }

    // iOS Safari: 홈 화면 추가 가이드 (PRD Feature 4 - Case 2, Step 1)
    if (isIOS && !isStandalone) {
        return <IOSInstallGuideModal open={showModal} onClose={handleClose} />;
    }

    // iOS Standalone: 알림 권한 요청 (PRD Feature 4 - Case 2, Step 2)
    if (isIOS && isStandalone) {
        return <IOSPushPermissionModal open={showModal} onClose={handleClose} />;
    }

    // 기기에 상관없이 회원가입 직후라면 권한 요청 (Fallback for Desktop 등)
    return <PushPermissionModal open={showModal} onClose={handleClose} />;
}

export function PostSignupFlow() {
    return (
        <Suspense fallback={null}>
            <PostSignupFlowInternal />
        </Suspense>
    );
}
