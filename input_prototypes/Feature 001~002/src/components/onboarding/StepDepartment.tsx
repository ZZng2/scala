import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { departments } from '../../data/departments';
import { Department } from '../../types';

interface StepDepartmentProps {
  value?: Department;
  onChange: (dept: Department) => void;
  onNext: () => void;
}

export function StepDepartment({ value, onChange, onNext }: StepDepartmentProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">학과를 알려주세요</h2>
        <p className="text-muted-foreground">정확한 장학금 매칭을 위해 필요해요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-12 text-base font-normal px-4"
            >
              {value ? `${value.college} ${value.name}` : "학과 검색..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="학과명 검색..." />
              <CommandList>
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {departments.map((dept) => (
                    <CommandItem
                      key={dept.id}
                      value={`${dept.college} ${dept.name}`}
                      onSelect={() => {
                        onChange(dept);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === dept.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {dept.college} {dept.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button 
          className="w-full h-12 mt-4 text-base" 
          disabled={!value}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
