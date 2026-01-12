'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    open: boolean;
    onClose: () => void;
    isStandalone?: boolean; // PWA 모드인지 여부
}

export function IOSPushGuideCarousel({ open, onClose, isStandalone = false }: Props) {
    // PWA면 설정 가이드(1)가 기본, Safari면 설치 가이드(0)가 기본
    const [currentSlide, setCurrentSlide] = useState(isStandalone ? 1 : 0);

    const installSteps = [
        { id: 1, text: '오른쪽 하단 ··· 클릭' },
        { id: 2, text: '공유 버튼 클릭' },
        { id: 3, text: '오른쪽 하단 더 보기(···) 클릭' },
        { id: 4, text: '"홈 화면에 추가" 선택' },
        { id: 5, text: '"사파리를 닫고, 바탕화면에 생긴 앱을 실행해주세요!"', highlight: true },
        { id: 6, text: '앱 실행 후 알림 권한 허용' },
    ];

    const settingsSteps = [
        { id: 1, text: '설정 앱 열기' },
        { id: 2, text: 'Safari 선택' },
        { id: 3, text: '웹사이트 설정 선택' },
        { id: 4, text: 'scala-dongguk.vercel.app 찾기' },
        { id: 5, text: '알림 허용으로 변경', highlight: true },
    ];

    const slides = [
        {
            emoji: '🍎',
            title: '아이폰을 사용 중이시네요',
            description: 'Apple 정책상 홈 화면에 추가해야만\n실시간 알림을 드릴 수 있어요!',
            steps: installSteps,
        },
        {
            emoji: '⚙️',
            title: 'PUSH 알림 설정 방법',
            description: 'iOS에서는 설정에서 직접\n알림을 허용해주셔야 해요!',
            steps: settingsSteps,
        },
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0" showCloseButton={false}>
                <div className="py-2 relative">
                    {/* Slide Indicator */}
                    <div className="flex justify-center gap-2 mb-4">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${index === currentSlide
                                        ? 'w-6 bg-[#FF6B35]'
                                        : 'w-1.5 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Carousel Content */}
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{slides[currentSlide].emoji}</span>
                                    <h2 className="text-xl font-bold text-[#212121]">
                                        {slides[currentSlide].title}
                                    </h2>
                                </div>
                                <p className="text-sm text-[#757575] mb-8 leading-relaxed whitespace-pre-line">
                                    {slides[currentSlide].description}
                                </p>

                                <div className="space-y-4 mb-8">
                                    {slides[currentSlide].steps.map((step) => (
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
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                        {currentSlide > 0 && (
                            <Button
                                onClick={handlePrev}
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-[#E0E0E0]"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                이전
                            </Button>
                        )}
                        {currentSlide < slides.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                className="flex-1 h-12 bg-[#FF6B35] hover:bg-[#E55A2A] text-white font-semibold rounded-xl"
                            >
                                다음
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={onClose}
                                className="flex-1 h-12 bg-[#FF6B35] hover:bg-[#E55A2A] text-white font-semibold rounded-xl"
                            >
                                확인했어요
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
