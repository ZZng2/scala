import React, { useEffect, useState } from 'react';
import { UserData, Scholarship } from '../../types';
import { mockScholarships } from '../../data/scholarships';
import { ScholarshipCard } from './ScholarshipCard';
import { Button } from '../ui/button';
import { RefreshCcw, Search } from 'lucide-react';
import StickyBar from './StickyBar';

interface HomeFeedProps {
  userData: UserData;
  onReset: () => void;
}

export function HomeFeed({ userData, onReset }: HomeFeedProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Simulate API query delay
    const timer = setTimeout(() => {
      // Sort by deadline (D-Day ascending)
      const today = new Date();
      const sorted = [...mockScholarships]
        .map(s => {
          const deadline = new Date(s.deadline);
          const diffTime = deadline.getTime() - today.getTime();
          const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { ...s, d_day: dDay };
        })
        .sort((a, b) => (a.d_day || 0) - (b.d_day || 0));

      // Filter logic based on user data (simple simulation)
      // Example: If user income bracket is 9, hide need-based scholarships (assuming s2 is need-based)
      // This is just a placeholder logic.
      let filtered = sorted;
      if (userData.income_bracket && userData.income_bracket >= 9) {
         // Filter out extremely specific need-based ones if defined in data
         // For now, we return all sorted
      }

      setScholarships(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [userData]);

  if (loading) {
      return <div className="min-h-screen bg-surface" />;
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="bg-primary/10 p-6 pb-12 rounded-b-[2rem]">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            {userData.department_name} {userData.grade}학년을 위한<br/>
            장학금이 <span className="text-primary">{scholarships.length}개</span> 있어요!
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            입력하신 조건(소득 {userData.income_bracket === 11 ? '미지정' : `${userData.income_bracket}구간`}, {userData.avg_gpa}점)에 맞춰 찾았습니다.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 space-y-4 mb-20">
        {scholarships.length > 0 ? (
            scholarships.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
            ))
        ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-border mt-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">조건에 딱 맞는 공고가 아직 없어요.</h3>
                <p className="text-muted-foreground text-sm mb-6">
                    하지만 내일 당장 올라올 수도 있어요.<br/>
                    스칼라가 매일 지켜보다가 뜨면 바로 알려드릴까요?
                </p>
                <Button className="w-full font-bold">
                    3초 만에 알림 예약하기
                </Button>
                <p className="text-xs text-muted-foreground mt-2">카카오로 간편하게 시작</p>
            </div>
        )}

        {scholarships.length > 0 && (
            <div className="pt-8 pb-4 text-center">
                <Button variant="outline" onClick={onReset} className="gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    조건 다시 입력하기
                </Button>
            </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Sign Up Conversion - Only for Guests */}
      {!isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 h-[60px] z-50">
            <StickyBar />
        </div>
      )}
    </div>
  );
}
