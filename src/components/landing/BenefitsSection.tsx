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

                {/* iPhone Mockup with Push Notification */}
                <div className="relative w-full max-w-[320px] aspect-[9/19] bg-gradient-to-b from-gray-100 to-gray-200 rounded-[32px] border-[8px] border-gray-800 shadow-2xl overflow-hidden mb-16 mx-auto">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-xs font-semibold text-gray-700">
                        <span>15:15</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
                                <path d="M0 2h3v8H0V2zm5 0h3v8H5V2zm5 0h3v8h-3V2zm5-2v12h1V0h-1z" />
                            </svg>
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M11.5 1A3.5 3.5 0 0 0 8 4.5V7H7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V4.5A3.5 3.5 0 0 0 11.5 1z" />
                            </svg>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="absolute top-20 left-0 right-0 text-center">
                        <div className="text-6xl font-light text-gray-700 tracking-tight">15:17</div>
                        <div className="text-sm text-gray-600 mt-1">1월 12일 (월)</div>
                    </div>

                    {/* Push Notification */}
                    <div className="absolute bottom-32 left-4 right-4">
                        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg">
                            <div className="flex items-start gap-3">
                                {/* App Icon */}
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0 shadow-md">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm text-gray-900">Scala</span>
                                        <span className="text-xs text-gray-500">지금</span>
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium mb-1">
                                        새로운 장학금이 등록되었어요!
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        2025년 동국대학교 성적우수장학금 - 마감 D-7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
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
