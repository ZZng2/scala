import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface StepGradeProps {
  grade?: number;
  enrollmentStatus?: 'enrolled' | 'on_leave';
  onChange: (data: { grade?: number; enrollmentStatus?: 'enrolled' | 'on_leave' }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepGrade({ grade, enrollmentStatus, onChange, onNext, onPrev }: StepGradeProps) {
  const isValid = grade !== undefined && enrollmentStatus !== undefined;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">학년과 재학 상태를<br/>알려주세요</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground">학년</label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((g) => (
              <button
                key={g}
                onClick={() => onChange({ grade: g, enrollmentStatus })}
                className={cn(
                  "h-12 rounded-lg border text-base font-medium transition-all",
                  grade === g
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-white text-muted-foreground hover:bg-surface"
                )}
              >
                {g}학년
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground">재학 상태</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'enrolled', label: '재학' },
              { value: 'on_leave', label: '휴학' }
            ].map((status) => (
              <button
                type="button"
                key={status.value}
                onClick={() => onChange({ grade, enrollment_status: status.value } as any)}
                className={cn(
                  "h-12 rounded-lg border text-base font-medium transition-all",
                  enrollmentStatus === status.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-white text-muted-foreground hover:bg-surface"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
          이전
        </Button>
        <Button 
          className="flex-[2] h-12 text-base" 
          disabled={!isValid}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
