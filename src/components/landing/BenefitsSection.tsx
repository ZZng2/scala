'use client';

import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        // 회원가입 수 조회
        fetch('/api/stats/signups')
            .then(res => res.json())
            .then(data => setSignupCount(data.count))
            .catch(() => setSignupCount(13)); // 에러 시 기본값
    }, []);
    return (
        <div className="bg-white pb-32"> {/* Extra padding for sticky bar */}
            <div className="max-w-[1024px] mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">

                {/* Headline */}
                <h2 className="font-bold text-[#212121] mb-12 leading-tight">
                    <span className="block text-3xl md:text-5xl mb-3">어? 나도 해당되네?</span>
                    <span className="block text-xl md:text-3xl text-[#757575]">의외의 <span className="text-[#FF6B35]">용돈, 알림</span>으로 확인하세요.</span>
                </h2>

                {/* iPhone Mockup with iOS-style Notification */}
                <div className="relative w-full max-w-[320px] aspect-[9/19] bg-gradient-to-br from-gray-600 via-blue-900 to-teal-700 rounded-[32px] border-[8px] border-black shadow-2xl overflow-hidden mb-16 mx-auto">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10"></div>

                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 text-xs font-semibold text-white z-0">
                        <span className="invisible">9:41</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
                                <path d="M0 2h3v8H0V2zm5 0h3v8H5V2zm5 0h3v8h-3V2zm5-2v12h1V0h-1z" />
                            </svg>
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M6 0L0 6h12L6 0z" />
                            </svg>
                            <svg className="w-6 h-3" viewBox="0 0 24 12" fill="currentColor">
                                <rect width="18" height="12" rx="2" opacity="0.4" />
                                <rect width="18" height="12" rx="2" fill="currentColor" />
                                <rect x="20" y="4" width="2" height="4" rx="1" />
                            </svg>
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="absolute top-24 left-0 right-0 text-center">
                        <div className="text-sm text-white/80 mb-2">4월 1일 (화)</div>
                        <div className="text-7xl font-extralight text-white tracking-tighter">9:41</div>
                    </div>

                    {/* Notification Card */}
                    <div className="absolute bottom-40 left-4 right-4">
                        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-4 shadow-xl border border-white/10">
                            <div className="flex items-start gap-3">
                                {/* App Icon - Using actual app icon */}
                                <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden shadow-lg">
                                    <img
                                        src="/icon-192.png"
                                        alt="Scala"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm text-white">Scala</span>
                                        <span className="text-xs text-white/60">지금</span>
                                    </div>
                                    <p className="text-sm text-white font-medium mb-2 leading-snug">
                                        지원할 수 있는 장학금이 올라왔어요!
                                    </p>
                                    <p className="text-xs text-white/80 leading-relaxed">
                                        세아해암 장학생 모집, 생활비성, 학기 당 300만원, D-7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-16">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                            </svg>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3.2" />
                                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                            </svg>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/40 rounded-full"></div>
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
