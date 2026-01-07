import React from 'react';
import { Filter, Bell, CalendarCheck } from 'lucide-react';
import { Button } from './ui/button'; // Assuming shadcn button exists or I'll use standard button if not
import { LiveBenefitTicker } from './LiveBenefitTicker';

export const BenefitsSection = () => {
  return (
    <div className="bg-white pb-32"> {/* Extra padding for sticky bar */}
      <div className="max-w-[1024px] mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
        
        {/* Headline */}
        <h2 className="font-bold text-text-primary mb-12 leading-tight">
          <span className="block text-3xl md:text-5xl mb-3">어? 나도 해당되네?</span>
          <span className="block text-xl md:text-3xl text-text-secondary">의외의 <span className="text-primary">용돈, 알림</span>으로 확인하세요.</span>
        </h2>

        {/* Mockup Visual */}
        <div className="relative w-full max-w-[320px] aspect-[9/19] bg-surface rounded-[32px] border-[8px] border-border shadow-2xl overflow-hidden mb-16 mx-auto">
          {/* Mockup Content (Blurred) */}
          <div className="absolute inset-0 bg-white p-4 flex flex-col gap-4 filter blur-[2px]">
            <div className="h-8 w-full bg-gray-100 rounded-md" />
            <div className="h-32 w-full bg-orange-50 rounded-xl" />
            <div className="h-24 w-full bg-gray-50 rounded-xl" />
            <div className="h-24 w-full bg-gray-50 rounded-xl" />
            <div className="h-24 w-full bg-gray-50 rounded-xl" />
          </div>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
              <Filter size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              지원 가능한 공고만
            </h3>
            <p className="text-text-secondary text-sm">
              내 학과, 학년, 소득분위에 맞는<br/>
              공고만 필터링해서 보여드려요
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              장학 공고가 등록될 때마다
            </h3>
            <p className="text-text-secondary text-sm">
              놓치지 않도록 실시간 알림으로<br/>
              가장 빠르게 알려드려요
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
              <CalendarCheck size={32} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              이번 학기 장학금 받을 때까지
            </h3>
            <p className="text-text-secondary text-sm">
              하루 1번 꼴로 올라오는 장학금,<br/>
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
              현재 <span className="text-[#FF6B35]">13명</span>이 PUSH 알림 신청
            </p>
          </div>
          
          <LiveBenefitTicker />
        </div>

        {/* Main CTA */}
        <button className="w-full md:w-auto px-12 py-5 bg-primary hover:bg-[#E55A2A] text-white text-xl font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center text-center leading-snug">
          딱 10초면 끝,<br/>지금 지원 가능한 장학금 보기
        </button>

      </div>
    </div>
  );
};
