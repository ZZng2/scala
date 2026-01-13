'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Search, Check, X, ChevronDown, ChevronUp, AlertCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { departments as DEPARTMENTS_DATA, REGIONS } from '@/data/departments';

interface Scholarship {
    id: string;
    title: string;
    category: string | null;
    target_departments?: string[] | null;
    target_grades?: number[] | null;
    min_gpa?: number | null;
    max_income_bracket?: number | null;
    target_regions?: string[] | null;
}

export default function AdminNotificationsPage() {

    const [loading, setLoading] = useState(false);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedScholarship, setSelectedScholarship] = useState<string>('none');

    // Targeting State
    const [targetDepts, setTargetDepts] = useState<string[]>([]); // 학과 (다중)
    const [targetGrade, setTargetGrade] = useState<string[]>([]); // 학년
    const [minGpa, setMinGpa] = useState<string>(''); // 최소 학점
    const [maxIncome, setMaxIncome] = useState<string>(''); // 최대 소득분위
    const [targetRegions, setTargetRegions] = useState<string[]>([]); // 거주 지역
    const [specialConditions, setSpecialConditions] = useState({
        is_multi_child: false,
        has_disability: false,
        is_national_merit: false,
    });

    // UI State for Department Selector
    const [deptSearchQuery, setDeptSearchQuery] = useState('');
    const [isDeptListOpen, setIsDeptListOpen] = useState(false);

    // Preview Count State
    const [targetCount, setTargetCount] = useState<number | null>(null);
    const [countLoading, setCountLoading] = useState(false);

    // Fetch target count
    const fetchTargetCount = useCallback(async () => {
        setCountLoading(true);
        try {
            const response = await fetch('/api/admin/notifications/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_depts: targetDepts.length > 0 ? targetDepts : undefined,
                    target_grade: targetGrade.length > 0 ? targetGrade.map(Number) : undefined,
                    min_gpa: minGpa ? parseFloat(minGpa) : undefined,
                    max_income_bracket: maxIncome ? parseInt(maxIncome) : undefined,
                    target_regions: targetRegions.length > 0 ? targetRegions : undefined,
                    special_conditions: specialConditions,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                setTargetCount(result.target_count);
            }
        } catch (error) {
            console.error('Failed to fetch target count:', error);
        } finally {
            setCountLoading(false);
        }
    }, [targetDepts, targetGrade, minGpa, maxIncome, targetRegions, specialConditions]);

    // Fetch count on mount and when targeting changes (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTargetCount();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchTargetCount]);

    // Fetch Scholarships for linkage
    useEffect(() => {
        const fetchScholarships = async () => {
            const { data, error } = await supabase
                .from('scholarships')
                .select('id, title, category, target_departments, target_grades, min_gpa, max_income_bracket, target_regions')
                .eq('is_closed', false)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) setScholarships(data);
        };
        fetchScholarships();
    }, []);

    // Auto-fill targeting when scholarship is selected
    useEffect(() => {
        if (selectedScholarship === 'none') {
            return;
        }

        const scholarship = scholarships.find(s => s.id === selectedScholarship);
        if (scholarship) {
            // Auto-fill targeting fields from scholarship data
            if (scholarship.target_departments && scholarship.target_departments.length > 0) {
                setTargetDepts(scholarship.target_departments);
            }
            if (scholarship.target_grades && scholarship.target_grades.length > 0) {
                setTargetGrade(scholarship.target_grades.map(String));
            }
            if (scholarship.min_gpa !== null && scholarship.min_gpa !== undefined) {
                setMinGpa(scholarship.min_gpa.toString());
            }
            if (scholarship.max_income_bracket !== null && scholarship.max_income_bracket !== undefined) {
                setMaxIncome(scholarship.max_income_bracket.toString());
            }
            if (scholarship.target_regions && scholarship.target_regions.length > 0) {
                setTargetRegions(scholarship.target_regions);
            }
        }
    }, [selectedScholarship, scholarships]);

    // Department Handlers (Same as AdminScholarshipsPage)
    const handleDeptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const filtered = DEPARTMENTS_DATA.filter(d =>
                d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                d.college.toLowerCase().includes(deptSearchQuery.toLowerCase())
            );

            if (filtered.length > 0) {
                const firstMatch = filtered[0].name;
                if (!targetDepts.includes(firstMatch)) {
                    setTargetDepts(prev => [...prev, firstMatch]);
                }
                setDeptSearchQuery('');
            }
        }
    };

    const toggleDepartment = (deptName: string) => {
        setTargetDepts(prev =>
            prev.includes(deptName)
                ? prev.filter(d => d !== deptName)
                : [...prev, deptName]
        );
    };

    const renderGroupedDepartments = () => {
        const grouped = DEPARTMENTS_DATA.reduce((acc, dept) => {
            if (!acc[dept.college]) acc[dept.college] = [];
            acc[dept.college].push(dept);
            return acc;
        }, {} as Record<string, typeof DEPARTMENTS_DATA>);

        return Object.entries(grouped).map(([college, depts]) => (
            <div key={college} className="mb-4">
                <h5 className="text-sm font-bold text-[#212121] mb-2">{college}</h5>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {depts.map((dept) => {
                        const isSelected = targetDepts.includes(dept.name);
                        return (
                            <div
                                key={dept.id}
                                onClick={() => toggleDepartment(dept.name)}
                                className={`
                                    cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border
                                    ${isSelected
                                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                        : 'bg-white text-[#424242] border-[#E0E0E0] hover:bg-[#FAFAFA]'}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{dept.name}</span>
                                    {isSelected && <Check size={14} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ));
    };

    // Other Handlers
    const handleGradeToggle = (grade: string) => {
        setTargetGrade(prev =>
            prev.includes(grade)
                ? prev.filter(g => g !== grade)
                : [...prev, grade]
        );
    };

    const handleRegionToggle = (region: string) => {
        setTargetRegions(prev =>
            prev.includes(region)
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };

    const handleSpecialToggle = (key: keyof typeof specialConditions) => {
        setSpecialConditions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSend = async () => {
        if (!title || !body) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    body,
                    target_depts: targetDepts.length > 0 ? targetDepts : undefined,
                    target_grade: targetGrade.length > 0 ? targetGrade.map(Number) : undefined,
                    min_gpa: minGpa ? parseFloat(minGpa) : undefined,
                    max_income_bracket: maxIncome ? parseInt(maxIncome) : undefined,
                    target_regions: targetRegions.length > 0 ? targetRegions : undefined,
                    special_conditions: specialConditions,
                    scholarship_id: selectedScholarship === 'none' ? undefined : selectedScholarship,
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            toast.success(`알림 발송 성공! (대상: ${result.sent_count}명)`);

            // Reset Form (Optional)
            setTitle('');
            setBody('');
            setSelectedScholarship('none');
            // Keep targeting options or reset them based on preference? Usually keep for repeated sending or slightly modified sending.
            // setTargetDepts([]);
            // setTargetGrade([]);
            // setMinGpa('');
            // setMaxIncome('');
            // setTargetRegions([]);
            // setSpecialConditions({ is_multi_child: false, has_disability: false, is_national_merit: false });

        } catch (error: any) {
            console.error('Send Error:', error);
            toast.error(`발송 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div>
                <h2 className="text-2xl font-bold text-[#212121]">푸시 알림 발송</h2>
                <p className="text-[#757575]">조건에 맞는 사용자들에게 맞춤 알림을 보냅니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>알림 내용</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>알림 제목</Label>
                                <Input
                                    placeholder="예: [마감임박] 국가장학금 신청하세요!"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>알림 내용</Label>
                                <Textarea
                                    placeholder="알림 본문을 입력하세요."
                                    className="h-32 resize-none"
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>연결할 장학금 (선택)</Label>
                                <Select value={selectedScholarship} onValueChange={setSelectedScholarship}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="장학금 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">선택 안함</SelectItem>
                                        {scholarships.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                [{s.category === 'tuition' ? '등록금' : '생활비'}] {s.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>발송 대상 타겟팅</CardTitle>
                            <CardDescription>조건을 입력하지 않으면 전체 사용자에게 발송됩니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* 1. Department */}
                            <div className="space-y-2">
                                <Label>학과 (선택)</Label>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                                            <Input
                                                className="pl-9"
                                                placeholder="학과 검색 (엔터 시 자동 추가)"
                                                value={deptSearchQuery}
                                                onChange={(e) => setDeptSearchQuery(e.target.value)}
                                                onKeyDown={handleDeptKeyDown}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDeptListOpen(!isDeptListOpen)}
                                            className="min-w-[100px]"
                                        >
                                            {isDeptListOpen ? '목록 닫기' : '전체 목록'}
                                        </Button>
                                    </div>

                                    {/* Selected Departments Tags */}
                                    {targetDepts.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-dashed">
                                            {targetDepts.map(dept => (
                                                <Badge key={dept} variant="secondary" className="bg-white border hover:bg-white text-sm py-1">
                                                    {dept}
                                                    <button
                                                        onClick={() => toggleDepartment(dept)}
                                                        className="ml-2 hover:text-red-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </Badge>
                                            ))}
                                            <button
                                                onClick={() => setTargetDepts([])}
                                                className="text-xs text-[#757575] hover:text-red-500 underline ml-2"
                                            >
                                                전체 삭제
                                            </button>
                                        </div>
                                    )}

                                    {/* Full Department List */}
                                    {isDeptListOpen && (
                                        <div className="mt-4 p-4 border rounded-xl bg-gray-50 max-h-[400px] overflow-y-auto">
                                            {renderGroupedDepartments()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 2. Grade & GPA & Income */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>대상 학년</Label>
                                    <div className="flex gap-2">
                                        {['1', '2', '3', '4'].map(grade => (
                                            <button
                                                key={grade}
                                                onClick={() => handleGradeToggle(grade)}
                                                className={`
                                                    w-10 h-10 rounded-lg font-medium border transition-colors
                                                    ${targetGrade.includes(grade)
                                                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                                        : 'bg-white text-[#757575] border-[#E0E0E0] hover:bg-[#F8F9FA]'}
                                                `}
                                            >
                                                {grade}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-500 mb-1 block">최소 학점 (0 ~ 4.5)</Label>
                                            <Input
                                                type="number" step="0.1" min="0" max="4.5"
                                                placeholder="예: 3.0"
                                                value={minGpa}
                                                onChange={e => setMinGpa(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500 mb-1 block">최대 소득분위 (1 ~ 10)</Label>
                                            <Input
                                                type="number" min="0" max="10"
                                                placeholder="예: 8"
                                                value={maxIncome}
                                                onChange={e => setMaxIncome(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Regions */}
                            <div className="space-y-2">
                                <Label>거주 지역 (중복 선택 가능)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {REGIONS.map(region => (
                                        <Badge
                                            key={region}
                                            variant="outline"
                                            className={`
                                                cursor-pointer px-3 py-1.5 transition-colors
                                                ${targetRegions.includes(region)
                                                    ? 'bg-[#FF6B35] text-white border-transparent'
                                                    : 'hover:bg-gray-100'}
                                            `}
                                            onClick={() => handleRegionToggle(region)}
                                        >
                                            {region}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Special Conditions */}
                            <div className="space-y-3 pt-2 border-t">
                                <Label>특수 조건 (선택 시 해당자에게만 발송)</Label>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                            checked={specialConditions.is_multi_child}
                                            onChange={() => handleSpecialToggle('is_multi_child')}
                                        />
                                        <span className="text-sm">다자녀 가구</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                            checked={specialConditions.has_disability}
                                            onChange={() => handleSpecialToggle('has_disability')}
                                        />
                                        <span className="text-sm">장애인</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                            checked={specialConditions.is_national_merit}
                                            onChange={() => handleSpecialToggle('is_national_merit')}
                                        />
                                        <span className="text-sm">국가유공자</span>
                                    </label>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Right: Preview & Action */}
                <div className="space-y-6">
                    <Card className="bg-[#F8F9FA] border-dashed sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-sm text-[#757575]">미리보기</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E0E0E0] mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center shrink-0">
                                        <span className="text-lg">📢</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-sm text-[#212121]">Scala</span>
                                            <span className="text-xs text-[#9E9E9E]">방금 전</span>
                                        </div>
                                        <p className="font-semibold text-sm text-[#212121] mb-1 truncate">
                                            {title || '알림 제목'}
                                        </p>
                                        <p className="text-xs text-[#757575] line-clamp-2">
                                            {body || '알림 내용이 여기에 표시됩니다.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="font-semibold text-black mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} /> 발송 타겟 요약
                                </div>
                                <ul className="space-y-1 text-xs list-disc pl-4 text-gray-500">
                                    {targetDepts.length > 0 && <li>학과: {targetDepts.length}개 선택됨</li>}
                                    {targetGrade.length > 0 && <li>학년: {targetGrade.join(', ')}학년</li>}
                                    {minGpa && <li>학점: {minGpa} 이상</li>}
                                    {maxIncome && <li>소득: {maxIncome}구간 이하</li>}
                                    {targetRegions.length > 0 && <li>지역: {targetRegions.length}개 선택됨</li>}
                                    {(specialConditions.is_multi_child || specialConditions.has_disability || specialConditions.is_national_merit) && (
                                        <li>특수조건 적용됨</li>
                                    )}
                                    {targetDepts.length === 0 && targetGrade.length === 0 && !minGpa && !maxIncome && targetRegions.length === 0 &&
                                        <li>조건 없음 (전체 발송)</li>
                                    }
                                </ul>
                            </div>

                            {/* Target Count Display */}
                            <div className="p-4 bg-white rounded-xl border-2 border-[#FF6B35]/30 mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="text-[#FF6B35]" />
                                        <span className="font-semibold text-[#212121]">발송 대상</span>
                                    </div>
                                    <div className="text-right">
                                        {countLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
                                        ) : (
                                            <span className="text-2xl font-bold text-[#FF6B35]">
                                                {targetCount !== null ? targetCount : '-'}명
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {targetCount === 0 && !countLoading && (
                                    <p className="text-xs text-red-500 mt-2">
                                        ⚠️ 조건에 맞는 푸시 가능 유저가 없습니다.
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full h-12 mt-6 text-base font-semibold bg-[#FF6B35] hover:bg-[#E85A2D]"
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        발송 중...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        알림 발송하기
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
