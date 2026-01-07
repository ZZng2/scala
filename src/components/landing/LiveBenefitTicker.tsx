'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LAST_NAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];

interface BenefitData {
    id: number;
    name: string;
    amount: string;
}

/**
 * 랜덤 데이터 생성
 * PRD 기준 금액 확률 분포:
 * - 100만+ (확률 60%)
 * - 200만+ (확률 30%)
 * - 300만+ (확률 10%)
 */
const generateRandomData = (id: number): BenefitData => {
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const randomValue = Math.random();
    let amount = '100만+';

    if (randomValue < 0.6) {
        amount = '100만+';
    } else if (randomValue < 0.9) {
        amount = '200만+';
    } else {
        amount = '300만+';
    }

    return {
        id,
        name: `${lastName}** 학우`,
        amount,
    };
};

/**
 * LiveBenefitTicker
 * 실시간 혜택 알림 롤링 티커
 * 
 * PRD 기준:
 * - 3초 간격으로 롤링
 * - 랜덤 성씨 + 금액 조합
 * - 아래에서 위로 슬라이드 애니메이션
 */
export function LiveBenefitTicker() {
    const [data, setData] = useState<BenefitData>(generateRandomData(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => generateRandomData(prev.id + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-12 flex items-center justify-center overflow-hidden mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={data.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-1.5 flex flex-col items-center justify-center text-center shadow-sm"
                >
                    <div className="flex items-center gap-1.5 text-[11px] leading-tight text-white">
                        <span className="opacity-90">{data.name} 조회 결과</span>
                        <span className="w-[1px] h-2.5 bg-white/20 mx-0.5"></span>
                        <span>지원 가능한 장학금 <span className="text-[#FFD700] font-bold">{data.amount}</span></span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
