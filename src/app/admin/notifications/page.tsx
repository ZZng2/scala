'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Scholarship {
    id: string;
    title: string;
    category: string;
}

export default function AdminNotificationsPage() {

    const [loading, setLoading] = useState(false);
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetDept, setTargetDept] = useState('');
    const [targetGrade, setTargetGrade] = useState<string[]>([]);
    const [selectedScholarship, setSelectedScholarship] = useState<string>('none');

    // Fetch Scholarships for linkage
    useEffect(() => {
        const fetchScholarships = async () => {
            const { data, error } = await supabase
                .from('scholarships')
                .select('id, title, category')
                .eq('is_closed', false)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) setScholarships(data);
        };
        fetchScholarships();
    }, [supabase]);

    const handleGradeToggle = (grade: string) => {
        setTargetGrade(prev =>
            prev.includes(grade)
                ? prev.filter(g => g !== grade)
                : [...prev, grade]
        );
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
                    target_dept: targetDept || undefined,
                    target_grade: targetGrade.length > 0 ? targetGrade.map(Number) : undefined,
                    scholarship_id: selectedScholarship === 'none' ? undefined : selectedScholarship,
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error);

            toast.success(`알림 발송 성공! (대상: ${result.sent_count}명)`);

            // Reset Form
            setTitle('');
            setBody('');
            setTargetDept('');
            setTargetGrade([]);
            setSelectedScholarship('none');

        } catch (error: any) {
            console.error('Send Error:', error);
            toast.error(`발송 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#212121]">푸시 알림 발송</h2>
                <p className="text-[#757575]">조건에 맞는 사용자들에게 맞춤 알림을 보냅니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>알림 내용 작성</CardTitle>
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
                                <p className="text-xs text-[#757575]">
                                    * 알림 클릭 시 해당 장학금 상세 페이지로 이동합니다.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>발송 대상 타겟팅</CardTitle>
                            <CardDescription>조건을 입력하지 않으면 전체 사용자에게 발송됩니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>학과 (부분 일치)</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                                    <Input
                                        className="pl-9"
                                        placeholder="예: 컴퓨터, 경영"
                                        value={targetDept}
                                        onChange={e => setTargetDept(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>학년</Label>
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
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Preview & Action */}
                <div className="space-y-6">
                    <Card className="bg-[#F8F9FA] border-dashed">
                        <CardHeader>
                            <CardTitle className="text-sm text-[#757575]">미리보기</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E0E0E0]">
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
                                            {title || '알림 제목이 여기에 표시됩니다.'}
                                        </p>
                                        <p className="text-xs text-[#757575] line-clamp-2">
                                            {body || '알림 내용이 여기에 표시됩니다. 학생들이 실제 받게 될 알림의 예시입니다.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        className="w-full h-12 text-base font-semibold bg-[#FF6B35] hover:bg-[#E85A2D]"
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
                </div>
            </div>
        </div>
    );
}
