import React from 'react';
import { Scholarship } from '../../lib/types';
import { Badge } from '../ui/badge';

interface DetailHeaderProps {
  scholarship: Scholarship;
}

export function DetailHeader({ scholarship }: DetailHeaderProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tuition': return '등록금성';
      case 'living': return '생활비성';
      case 'mixed': return '복합지원';
      default: return '기타';
    }
  };

  return (
    <div className="bg-background px-6 pt-6 pb-6 border-b border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-2 py-0.5 text-xs font-semibold">
          D-{scholarship.d_day}
        </Badge>
        <Badge variant="outline" className="text-[#9810FA] border-none font-normal text-xs bg-[#9810FA]/10">
          복합
        </Badge>
      </div>
      
      <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">
        {scholarship.title}
      </h1>
      
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">지원 금액</span>
        <span className="text-xl font-bold text-primary">
          {scholarship.amount_text}
        </span>
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-lg flex flex-col gap-2">
         <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">주관</span>
           <span className="font-medium text-foreground">{scholarship.organization}</span>
         </div>
         <div className="flex justify-between items-center text-sm">
           <span className="text-muted-foreground">마감일</span>
           <span className="font-medium text-foreground">{scholarship.deadline}</span>
         </div>
      </div>
    </div>
  );
}
