import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Scholarship } from '../../types';
import { Calendar, ChevronRight } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-border overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {scholarship.category === 'tuition' && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">등록금</Badge>
            )}
            {scholarship.category === 'living' && (
              <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100">생활비</Badge>
            )}
            {scholarship.category === 'mixed' && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-100">복합</Badge>
            )}
          </div>
          {scholarship.d_day !== undefined && (
             <span className="text-primary font-bold text-lg whitespace-nowrap">
               {scholarship.d_day > 0 ? `D-${scholarship.d_day}` : scholarship.d_day === 0 ? 'D-Day' : '마감'}
             </span>
          )}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {scholarship.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-2xl font-bold text-primary mb-1">{scholarship.amount_text}</p>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="w-4 h-4" />
          <span>~ {scholarship.deadline} 마감</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {/* Placeholder for "View Details" logic or link */}
      </CardFooter>
    </Card>
  );
}
