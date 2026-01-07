'use client';

import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from 'cmdk';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { departments } from '@/data/departments';
import { Department } from '@/types';

interface StepDepartmentProps {
    value?: Department;
    onChange: (dept: Department) => void;
    onNext: () => void;
}

/**
 * StepDepartment
 * 학과 선택 스텝
 * 
 * PRD 기준:
 * - 학과 검색 가능한 드롭다운
 * - department_id, name, college 모두 저장
 */
export function StepDepartment({ value, onChange, onNext }: StepDepartmentProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(search.toLowerCase()) ||
            dept.college.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#212121]">학과를 알려주세요</h2>
                <p className="text-[#757575]">정확한 장학금 매칭을 위해 필요해요.</p>
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
                        <Command className="bg-white rounded-md border border-[#E0E0E0] shadow-md">
                            <CommandInput
                                placeholder="학과명 검색..."
                                value={search}
                                onValueChange={setSearch}
                                className="h-10 border-b border-[#E0E0E0] px-3 outline-none"
                            />
                            <CommandList className="max-h-[300px] overflow-y-auto">
                                <CommandEmpty className="py-4 text-center text-sm text-[#757575]">
                                    검색 결과가 없습니다.
                                </CommandEmpty>
                                <CommandGroup>
                                    {filteredDepartments.map((dept) => (
                                        <CommandItem
                                            key={dept.id}
                                            value={`${dept.college} ${dept.name}`}
                                            onSelect={() => {
                                                onChange(dept);
                                                setOpen(false);
                                                setSearch('');
                                            }}
                                            className={cn(
                                                "px-3 py-2 cursor-pointer hover:bg-[#F8F9FA] flex items-center",
                                                value?.id === dept.id && "bg-[#F8F9FA]"
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value?.id === dept.id ? "opacity-100 text-[#FF6B35]" : "opacity-0"
                                                )}
                                            />
                                            <span className="text-sm">{dept.college} {dept.name}</span>
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
