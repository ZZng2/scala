'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { requestFCMToken } from '@/lib/firebase';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function IOSPushPermissionModal({ open, onClose }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPermission(Notification.permission);
        }
    }, []);

    const handleRequestPermission = async () => {
        setIsLoading(true);
        console.log('[Modal] "알림 받기" button clicked. Permission state:', Notification.permission);

        try {
            // 사용자 요청대로 설정 가이드 강제 없이 바로 권한 요청 시도
            const token = await requestFCMToken();

            if (token) {
                console.log('[Modal] Token received. Updating Supabase...');
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { error } = await supabase
                        .from('users')
                        .update({ fcm_token: token, push_enabled: true })
                        .eq('id', user.id);

                    if (error) {
                        console.error('[Modal] Error updating fcm_token in Supabase:', error);
                        toast.error('설정 저장 중 오류가 발생했습니다.');
                    } else {
                        console.log('[Modal] Supabase update successful');
                        toast.success('알림이 설정되었습니다!');
                    }
                }
                onClose();
            } else {
                // 토큰 발급 실패 (권한 거부 또는 기술적 이슈)
                const currentPermission = Notification.permission;
                console.warn('[Modal] FCM token request failed. Current permission:', currentPermission);

                if (currentPermission === 'denied') {
                    toast.error('알림 권한이 거부되었습니다.', {
                        description: '설정 > 알림에서 권한을 수동으로 허용해주셔야 합니다.'
                    });
                    onClose();
                } else if (currentPermission === 'granted') {
                    // 권한은 허용되었는데 토큰이 실패한 경우 (주로 기술적 문제)
                    toast.error('알림 설정 중 기술적인 오류가 발생했습니다.', {
                        description: '잠시 후 다시 시도해주시거나, 앱을 다시 실행해주세요.'
                    });
                    // 모달을 닫지 않고 재시도 기회를 줄 수도 있지만, 일단은 닫음
                    onClose();
                } else {
                    // 여전히 default거나 차단된 경우 (사용자가 창을 닫음 등)
                    toast.info('알림 권한 요청이 완료되지 않았습니다.');
                }
            }
        } catch (error: any) {
            console.error('[Modal] Unexpected error in handleRequestPermission:', error);
            toast.error('오류가 발생했습니다.', {
                description: error?.message || '다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 권한이 이미 허용되었으면 모달 표시 안 함 (부모에서 제어하겠지만 이중 체크)
    if (permission === 'granted') {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0" showCloseButton={false}>
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🔔</span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#212121] mb-4">
                        마지막 단계!<br />알림 권한을 허용해주세요
                    </h2>
                    <p className="text-[#757575] text-sm leading-relaxed mb-8">
                        새로운 장학금이 올라올 때마다<br />
                        실시간으로 학우님께 알려드릴게요!
                    </p>

                    <Button
                        onClick={handleRequestPermission}
                        disabled={isLoading}
                        className="w-full h-14 bg-[#FF6B35] hover:bg-[#E55A2A] text-white text-lg font-bold rounded-xl"
                    >
                        {isLoading ? '설정 중...' : '알림 받기'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
