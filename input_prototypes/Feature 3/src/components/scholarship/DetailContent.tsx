import React from 'react';
import { Scholarship } from '../../lib/types';
import { Separator } from '../ui/separator';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DetailContentProps {
  scholarship: Scholarship;
}

export function DetailContent({ scholarship }: DetailContentProps) {
  return (
    <div className="bg-background px-6 py-8 flex flex-col gap-8">
      
      {/* Target Section */}
      <section>
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          지원 대상
        </h3>
        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
          {scholarship.target_summary}
        </p>
        <div className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{scholarship.support_conditions}</span>
        </div>
      </section>

      <Separator />

      {/* Additional Info */}
      <section className="w-full">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          중복 수혜
        </h3>
        <p className="text-foreground/80 leading-relaxed">
          {scholarship.is_duplicate_allowed 
            ? '타 장학금과 중복 수혜가 가능합니다.' 
            : '타 장학금과 중복 수혜가 불가능합니다.'}
        </p>
      </section>
      
      {/* Bottom Spacer for sticky bar */}
      <div className="h-12" />
    </div>
  );
}
