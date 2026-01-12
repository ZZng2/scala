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
        try {
            const token = await requestFCMToken();

            if (token) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { error } = await supabase
                        .from('users')
                        .update({ fcm_token: token, push_enabled: true })
                        .eq('id', user.id);

                    if (error) {
                        console.error('Error updating fcm_token:', error);
                        toast.error('알림 설정 저장 중 오류가 발생했습니다.');
                    } else {
                        toast.success('알림 설정이 완료되었습니다!');
                    }
                }
                onClose();
            } else {
                toast.info('알림 권한이 필요합니다. 설정에서 직접 허용하실 수 있습니다.');
                onClose();
            }
        } catch (error) {
            console.error('Push permission error:', error);
            toast.error('알림 요청 중 오류가 발생했습니다.');
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
