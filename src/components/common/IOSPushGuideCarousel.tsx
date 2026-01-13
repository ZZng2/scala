'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
    open: boolean;
    onClose: () => void;
    isStandalone?: boolean; // PWA 모드인지 여부
}

export function IOSPushGuideCarousel({ open, onClose, isStandalone = false }: Props) {
    const installSteps = [
        { id: 1, text: '오른쪽 하단 ··· 클릭' },
        { id: 2, text: '공유 버튼 클릭', hasIcon: true },
        { id: 3, text: '오른쪽 하단 더 보기(···) 클릭' },
        { id: 4, text: '"홈 화면에 추가" 선택' },
        { id: 5, text: '사파리를 닫고,\n바탕화면에 생긴 앱을 실행해주세요!', highlight: true },
    ];

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0" showCloseButton={false}>
                <div className="py-2 relative">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🍎</span>
                        <h2 className="text-xl font-bold text-[#212121]">
                            아이폰을 사용 중이시네요
                        </h2>
                    </div>
                    <p className="text-sm text-[#757575] mb-4 leading-relaxed">
                        Apple 정책상 <span className="font-bold text-[#FF6B35]">홈화면</span>에 추가해야만<br />
                        <span className="font-bold text-[#FF6B35]">PUSH 알림</span>을 드릴 수 있어요!
                    </p>

                    {/* Safari 안내 문구 */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-amber-800 font-medium">
                            ⚠️ <span className="font-bold">Safari</span>로 열어서 홈 화면에 추가하세요!
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                            Chrome, 카카오톡 등 다른 브라우저에서는 불가능해요.
                        </p>
                    </div>

                    {/* 백그라운드 알림 안내 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-blue-800 font-medium">
                            💡 <span className="font-bold">알림을 받으려면</span> 앱을 완전히 종료하세요!
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            앱 사용 후 위로 슬라이드하여 종료해야 알림이 정상적으로 옵니다.
                        </p>
                    </div>


                    <div className="space-y-4 mb-8">
                        {installSteps.map((step) => (
                            <div
                                key={step.id}
                                className="flex items-start gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {step.id}
                                </div>
                                <p className={`text-sm leading-tight whitespace-pre-line ${step.highlight ? 'text-[#FF6B35] font-bold' : 'text-[#424242]'}`}>
                                    {(step as any).hasIcon && (
                                        <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                            <polyline points="16 6 12 2 8 6" />
                                            <line x1="12" y1="2" x2="12" y2="15" />
                                        </svg>
                                    )}
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
