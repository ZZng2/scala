'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function IOSPushSettingsGuideModal({ open, onClose }: Props) {
    const steps = [
        { id: 1, text: '설정 앱 열기' },
        { id: 2, text: 'Safari 선택' },
        { id: 3, text: '웹사이트 설정 선택' },
        { id: 4, text: 'scala-dongguk.vercel.app 찾기' },
        { id: 5, text: '알림 허용으로 변경', highlight: true },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0" showCloseButton={false}>
                <div className="py-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚙️</span>
                        <h2 className="text-xl font-bold text-[#212121]">
                            알림 설정 방법
                        </h2>
                    </div>
                    <p className="text-sm text-[#757575] mb-8 leading-relaxed">
                        iOS에서는 설정에서 직접<br />
                        알림을 허용해주셔야 해요!
                    </p>

                    <div className="space-y-4 mb-8">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {step.id}
                                </div>
                                <p className={`text-sm leading-tight ${step.highlight ? 'text-[#FF6B35] font-bold' : 'text-[#424242]'}`}>
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full h-12 bg-[#FF6B35] hover:bg-[#E55A2A] text-white font-semibold rounded-xl"
                    >
                        확인했어요
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
