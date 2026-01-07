import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

interface StepIncomeProps {
  incomeBracket?: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepIncome({ incomeBracket, onChange, onNext, onPrev }: StepIncomeProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">소득분위를 알려주세요</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                 <Info className="w-5 h-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>한국장학재단 기준 소득구간입니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground">정확한 장학금 추천을 위해 필요해요.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={cn(
                "h-12 rounded-lg border text-base font-medium transition-all",
                incomeBracket === num
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-white text-muted-foreground hover:bg-surface"
              )}
            >
              {num}구간
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onChange(11)}
          className={cn(
            "w-full h-auto py-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1",
            incomeBracket === 11
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-white text-muted-foreground hover:bg-surface"
          )}
        >
          <span className="text-base font-medium">잘 모르겠어요.</span>
          <span className="text-xs opacity-80 font-normal">(선택 시 소득분위 전체에 대한 알림을 받게 돼요)</span>
        </button>
      </div>

      <div className="flex gap-3 mt-auto">
        <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
          이전
        </Button>
        <Button 
          className="flex-[2] h-12 text-base" 
          disabled={incomeBracket === undefined}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
