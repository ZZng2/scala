import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface StepRegionProps {
  region?: string;
  hasDisability: boolean;
  isMultiChild: boolean;
  isNationalMerit: boolean;
  onChange: (data: { 
    hometown_region?: string;
    has_disability?: boolean;
    is_multi_child_family?: boolean;
    is_national_merit?: boolean;
  }) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

const REGIONS = [
  "서울", "경기", "인천", "강원", "충북", "충남", "대전", "세종",
  "전북", "전남", "광주", "경북", "경남", "대구", "울산", "부산", "제주", "해외"
];

export function StepRegion({ 
  region, 
  hasDisability, 
  isMultiChild, 
  isNationalMerit, 
  onChange, 
  onSubmit, 
  onPrev 
}: StepRegionProps) {
  
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">거주지와 추가 정보를<br/>확인해주세요</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-base font-semibold text-foreground">출신 고교 지역</label>
          <Select value={region} onValueChange={(val) => onChange({ hometown_region: val })}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="text-base font-semibold text-foreground">해당하는 항목이 있나요?</label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface cursor-pointer" onClick={() => onChange({ is_multi_child_family: !isMultiChild })}>
              <Checkbox id="multi-child" checked={isMultiChild} onCheckedChange={(c) => onChange({ is_multi_child_family: c as boolean })} />
              <Label htmlFor="multi-child" className="cursor-pointer flex-1 font-normal">다자녀 가구입니다</Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface cursor-pointer" onClick={() => onChange({ has_disability: !hasDisability })}>
              <Checkbox id="disability" checked={hasDisability} onCheckedChange={(c) => onChange({ has_disability: c as boolean })} />
              <Label htmlFor="disability" className="cursor-pointer flex-1 font-normal">장애인 본인 또는 자녀입니다</Label>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-surface cursor-pointer" onClick={() => onChange({ is_national_merit: !isNationalMerit })}>
              <Checkbox id="merit" checked={isNationalMerit} onCheckedChange={(c) => onChange({ is_national_merit: c as boolean })} />
              <Label htmlFor="merit" className="cursor-pointer flex-1 font-normal">국가유공자 본인 또는 자녀입니다</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <Button variant="outline" className="flex-1 h-12 text-base" onClick={onPrev}>
          이전
        </Button>
        <Button 
          className="flex-[2] h-12 text-base" 
          disabled={!region}
          onClick={onSubmit}
        >
          내 장학금 보기
        </Button>
      </div>
    </div>
  );
}
