'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function IOSInstallGuideModal({ open, onClose }: Props) {
    const steps = [
        { id: 1, text: '오른쪽 하단 ··· 클릭' },
        { id: 2, text: '공유 버튼 클릭' },
        { id: 3, text: '오른쪽 하단 더 보기(···) 클릭' },
        { id: 4, text: '"홈 화면에 추가" 선택' },
        { id: 5, text: '"사파리를 닫고, 바탕화면에 생긴 앱을 실행해주세요!"', highlight: true },
        { id: 6, text: '앱 실행 후 알림 권한 허용' },
    ];

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0" showCloseButton={false}>
                <div className="py-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🍎</span>
                        <h2 className="text-xl font-bold text-[#212121]">
                            아이폰을 사용 중이시네요
                        </h2>
                    </div>
                    <p className="text-sm text-[#757575] mb-8 leading-relaxed">
                        Apple 정책상 홈 화면에 추가해야만<br />
                        실시간 알림을 드릴 수 있어요!
                    </p>

                    <div className="space-y-4 mb-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {step.id}
                                </div>
                                <p className={`text-sm leading-tight ${step.highlight ? 'text-[#FF6B35] font-bold' : 'text-[#424242]'}`}>
                                    {step.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full h-12 bg-[#F8F9FA] hover:bg-[#F1F3F5] text-[#424242] font-semibold rounded-xl border border-[#E0E0E0]"
                    >
                        홈 화면에 추가했어요
                    </Button>

                    <div className="mt-4 flex justify-center">
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-[#FF6B35]"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
