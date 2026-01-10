'use client';

import React from 'react';
import { Header } from '@/components/common';
import { useRouter } from 'next/navigation';

/**
 * PrivacyPage
 * 개인정보 처리방침 페이지
 */
export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-[#212121]">개인정보 처리방침</h1>
                    <p className="text-[#757575] text-sm text-right">시행일: 2026. 01. 08</p>
                </div>

                <div className="space-y-6 text-[#424242] leading-relaxed">
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#212121]">1. 수집하는 개인정보 항목</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>필수항목: 학과, 학번, 학년, 재학상태, 전체 평균 평점, 직전 학기 평점, 소득분위, 출신 지역</li>
                            <li>선택항목: 이메일(인터뷰 요청 시), 장애 여부, 다자녀 여부, 국가유공자 여부</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#212121]">2. 개인정보의 수집 및 이용 목적</h2>
                        <p>수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>개인 맞춤형 장학금 매칭 서비스 제공</li>
                            <li>신규 장학금 알림(Push 알림) 서비스 제공</li>
                            <li>서비스 이용 통계 분석 및 품질 향상</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#212121]">3. 개인정보의 보유 및 이용기간</h2>
                        <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정 기간 동안 보관할 수 있습니다.</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#212121]">4. 개인정보의 파기절차 및 방법</h2>
                        <p>이용자가 회원탈퇴를 하거나 개인정보의 목적이 달성되면 해당 정보를 재생할 수 없는 방법으로 완전히 삭제합니다.</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-[#212121]">5. 이용자의 권리와 그 행사방법</h2>
                        <p>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.</p>
                    </section>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => router.back()}
                        className="w-full h-12 bg-[#FF6B35] text-white font-bold rounded-lg hover:bg-[#e85a24] transition-colors"
                    >
                        확인
                    </button>
                </div>
            </main>
        </div>
    );
}
