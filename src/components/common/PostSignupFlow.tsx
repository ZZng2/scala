'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDeviceDetect } from '@/lib/hooks/useDeviceDetect';
import { PushPermissionModal } from './PushPermissionModal';
import { IOSPushGuideCarousel } from './IOSPushGuideCarousel';
import { IOSPushPermissionModal } from './IOSPushPermissionModal';

function PostSignupFlowInternal() {
    const searchParams = useSearchParams();
    const { isIOS, isAndroid, isStandalone } = useDeviceDetect();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const postSignup = searchParams.get('postSignup');

        // 1. 회원가입 직후
        if (postSignup) {
            setShowModal(true);
            return;
        }

        // 2. iOS Standalone 또는 Android에서 푸시 권한 미요청 상태 체크
        const checkPushPermission = async () => {
            // localStorage에서 푸시 권한 요청 여부 확인
            const pushRequested = localStorage.getItem('push_permission_requested');

            if (pushRequested === 'true') return;

            // iOS Standalone 또는 Android에서 권한 체크
            if ((isIOS && isStandalone) || isAndroid) {
                if ('Notification' in window) {
                    const permission = Notification.permission;
                    // 권한이 granted가 아니면 모달 표시 (default 또는 denied)
                    if (permission !== 'granted') {
                        setShowModal(true);
                    }
                }
            }
        };

        checkPushPermission();
    }, [searchParams, isIOS, isAndroid, isStandalone]);

    const handleClose = () => {
        setShowModal(false);
        // 푸시 권한 요청 완료 표시
        localStorage.setItem('push_permission_requested', 'true');

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
        return <IOSPushGuideCarousel open={showModal} onClose={handleClose} isStandalone={false} />;
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
