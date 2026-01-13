'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Filter, Bell, CalendarCheck } from 'lucide-react';
import { LiveBenefitTicker } from './LiveBenefitTicker';

/**
 * BenefitsSection
 * 랜딩 페이지의 베네핏 그리드 + PWA 목업 + CTA
 * 
 * PRD 기준:
 * - 3가지 핵심 베네핏 그리드
 * - Social Proof (실시간 신청 현황)
 * - Live Benefit Ticker
 * - 메인 CTA 버튼
 */
export function BenefitsSection() {
    const [signupCount, setSignupCount] = useState(13);
    const [incomeFreeCount, setIncomeFreeCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const headlineRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // 회원가입 수 조회
        fetch('/api/stats/signups')
            .then(res => res.json())
            .then(data => setSignupCount(data.count))
            .catch(() => setSignupCount(13)); // 에러 시 기본값

        // 소득 무관 장학금 수 조회
        fetch('/api/scholarships?income_free=true')
            .then(res => res.json())
            .then(data => setIncomeFreeCount(data.count || data.length || 0))
            .catch(() => setIncomeFreeCount(0));
    }, []);

    // Intersection Observer로 스크롤 시 애니메이션 트리거
    useEffect(() => {
        if (!headlineRef.current || hasAnimated || incomeFreeCount === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        // 카운팅 애니메이션 (0 -> incomeFreeCount)
                        const duration = 1000; // 1초
                        const steps = 30;
                        const increment = incomeFreeCount / steps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= incomeFreeCount) {
                                setDisplayCount(incomeFreeCount);
                                clearInterval(timer);
                            } else {
                                setDisplayCount(Math.floor(current));
                            }
                        }, duration / steps);
                    }
                });
            },
            { threshold: 0.5 } // 50% 보일 때 트리거
        );

        observer.observe(headlineRef.current);

        return () => observer.disconnect();
    }, [incomeFreeCount, hasAnimated]);

    return (
        <div className="bg-white pb-32"> {/* Extra padding for sticky bar */}
            <div className="max-w-[1024px] mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">

                {/* Headline */}
                <h2 ref={headlineRef} className="font-bold text-[#212121] mb-12 leading-tight">
                    <span className="block text-3xl md:text-5xl mb-3">어? 나도 해당되네?</span>
                    <span className="block text-xl md:text-3xl text-[#757575]">
                        <span className="text-[#FF6B35]">소득 무관</span> 장학금 <span className="text-[#FF6B35]">현재</span> <span className="text-[#FF6B35] font-bold tabular-nums">{displayCount}</span><span className="text-[#FF6B35]">개</span>
                    </span>
                </h2>

                {/* iPhone Mockup */}
                <div className="relative w-full max-w-[320px] mb-16 mx-auto">
                    <img
                        src="/images/iphone_mockup.png"
                        alt="iPhone 푸시 알림 화면"
                        className="w-full h-auto"
                    />
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35]">
                            <Filter size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#212121]">
                            지원 가능한 공고만
                        </h3>
                        <p className="text-[#757575] text-sm">
                            내 학과, 학년, 소득분위에 맞는<br />
                            공고만 필터링해서 보여드려요
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35]">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#212121]">
                            장학 공고가 등록될 때마다
                        </h3>
                        <p className="text-[#757575] text-sm">
                            놓치지 않도록 실시간 알림으로<br />
                            가장 빠르게 알려드려요
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35]">
                            <CalendarCheck size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#212121]">
                            이번 학기 장학금 받을 때까지
                        </h3>
                        <p className="text-[#757575] text-sm">
                            하루 1번 꼴로 올라오는 장학금,<br />
                            이번 학기는 꼭 받게 해드릴게요.
                        </p>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-2 shadow-sm relative z-10">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <p className="text-gray-700 text-sm font-bold">
                            현재 <span className="text-[#FF6B35]">{signupCount}명</span>이 PUSH 알림 신청
                        </p>
                    </div>

                    <LiveBenefitTicker />
                </div>

                {/* Main CTA */}
                <Link
                    href="/onboarding"
                    className="w-full md:w-auto px-12 py-5 bg-[#FF6B35] hover:bg-[#E55A2A] text-white text-xl font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center text-center leading-snug"
                >
                    딱 10초면 끝,<br />지금 지원 가능한 장학금 보기
                </Link>

            </div>
        </div>
    );
}
