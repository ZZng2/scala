import React, { useState } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Scholarship } from '../../lib/types';
import { toast } from 'sonner';

interface StickyActionBarProps {
  scholarship: Scholarship;
}

export function StickyActionBar({ scholarship }: StickyActionBarProps) {
  const [isScrapped, setIsScrapped] = useState(scholarship.is_scrapped);

  const handleScrap = () => {
    setIsScrapped(!isScrapped);
    toast.success(isScrapped ? '장학금을 스크랩에서 제외했습니다.' : '장학금을 스크랩했습니다.', {
        description: isScrapped ? undefined : '마이페이지에서 확인할 수 있습니다.'
    });
  };

  const handleApply = () => {
    // Log click (mock)
    console.log('Clicked apply for', scholarship.id);
    
    // Open link
    window.open(scholarship.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
       <div className="w-full max-w-[480px] pointer-events-auto">
          <div className="h-16 w-full px-4 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.1)]"
               style={{ background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C5A 100%)' }}>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleScrap}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="스크랩"
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${isScrapped ? 'fill-white text-white' : 'text-white'}`} 
                />
              </button>
              <span className="text-white font-semibold text-sm hidden sm:block">
                 마감까지 {scholarship.d_day}일
              </span>
            </div>

            <button 
              onClick={handleApply}
              className="h-10 px-6 rounded-full bg-white text-[#FF6B35] font-bold text-sm shadow-md hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              장학금 받으러 가기
              <ExternalLink className="w-4 h-4" />
            </button>
            
          </div>
       </div>
    </div>
  );
}
