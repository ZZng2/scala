'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
    onComplete: () => void;
}

/**
 * LoadingScreen
 * 온보딩 완료 후 로딩 화면
 * 
 * PRD 기준:
 * - 1.5초 동안 진행 애니메이션
 * - "맞춤 장학금을 찾고 있어요" 텍스트
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
    useEffect(() => {
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 1500);

        return () => {
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
            <div className="w-[80%] max-w-md space-y-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-[#212121] mb-2">
                        맞춤 장학금을<br />찾고 있어요
                    </h2>
                    <p className="text-[#757575]">잠시만 기다려주세요...</p>
                </motion.div>

                <div className="relative w-full h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#FF6B35]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-[#FF6B35] font-medium"
                >
                    장학금 DB 조회 중...
                </motion.div>
            </div>
        </div>
    );
}
