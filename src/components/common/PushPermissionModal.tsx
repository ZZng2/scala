'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { requestFCMToken } from '@/lib/firebase';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function PushPermissionModal({ open, onClose }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestPermission = async () => {
        setIsLoading(true);
        try {
            const token = await requestFCMToken();

            if (token) {
                // Supabase users 테이블에 FCM 토큰 저장
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
                toast.info('알림 권한이 거부되었습니다. 설정에서 직접 허용하실 수 있습니다.');
                onClose();
            }
        } catch (error) {
            console.error('Push permission error:', error);
            toast.error('알림 요청 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#FF6B35" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-[#212121] mb-3">
                        알림을 켜고<br />장학금을 놓치지 마세요
                    </h2>
                    <p className="text-[#757575] text-sm leading-relaxed mb-8">
                        학우님께 딱 맞는 장학금이 올라오면<br />
                        실시간으로 가장 먼저 알려드릴게요!
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleRequestPermission}
                            disabled={isLoading}
                            className="w-full h-14 bg-[#FF6B35] hover:bg-[#E55A2A] text-white text-lg font-bold rounded-xl"
                        >
                            {isLoading ? '설정 중...' : '맞춤 장학금 알림 받기'}
                        </Button>
                        <button
                            onClick={onClose}
                            className="text-[#BDBDBD] text-sm font-medium py-2"
                        >
                            나중에 할게요
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
