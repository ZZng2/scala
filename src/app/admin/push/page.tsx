'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Send,
    Clock,
    Users,
    Bell,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

/**
 * AdminPushPage
 * Feature 8: 타겟 PUSH 발송
 */

// Mock 장학금 데이터
const targetScholarships = [
    { id: '1', title: '2026학년도 1학기 불교청년지도자 장학금', matchedUsers: 245 },
    { id: '2', title: '동국대학교 성적우수 장학금 (A형)', matchedUsers: 567 },
    { id: '3', title: '저소득층 학생 생활비 지원 장학금', matchedUsers: 189 },
];

export default function AdminPushPage() {
    const [selectedScholarship, setSelectedScholarship] = useState<string>('');
    const [pushTitle, setPushTitle] = useState('');
    const [pushBody, setPushBody] = useState('');
    const [sendType, setSendType] = useState<'immediate' | 'scheduled'>('immediate');
    const [scheduledTime, setScheduledTime] = useState('');

    const selectedData = targetScholarships.find(s => s.id === selectedScholarship);

    const handleSend = () => {
        // TODO: 실제 PUSH 발송 API 호출
        alert(`PUSH 발송!\n대상: ${selectedData?.matchedUsers}명\n제목: ${pushTitle}\n내용: ${pushBody}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-[#757575]">타겟 유저에게 맞춤 PUSH 알림을 발송하세요.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: 장학금 선택 & 에디터 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 장학금 선택 */}
                    <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                        <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-[#FF6B35]" />
                            발송 대상 장학금
                        </h3>
                        <Select value={selectedScholarship} onValueChange={setSelectedScholarship}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="장학금을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {targetScholarships.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.title} ({s.matchedUsers}명)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 알림 에디터 */}
                    <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                        <h3 className="text-lg font-bold text-[#212121] mb-4">알림 내용</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-[#212121] mb-2 block">제목</label>
                                <Input
                                    placeholder="예: 새로운 장학금이 등록되었어요!"
                                    value={pushTitle}
                                    onChange={(e) => setPushTitle(e.target.value)}
                                    maxLength={50}
                                />
                                <p className="text-xs text-[#757575] mt-1">{pushTitle.length}/50자</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-[#212121] mb-2 block">본문</label>
                                <textarea
                                    placeholder="예: 지금 바로 확인하고 지원하세요. 마감까지 D-14!"
                                    value={pushBody}
                                    onChange={(e) => setPushBody(e.target.value)}
                                    maxLength={100}
                                    className="w-full h-24 px-3 py-2 border border-[#E0E0E0] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                                />
                                <p className="text-xs text-[#757575] mt-1">{pushBody.length}/100자</p>
                            </div>
                        </div>
                    </div>

                    {/* 발송 설정 */}
                    <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                        <h3 className="text-lg font-bold text-[#212121] mb-4">발송 설정</h3>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setSendType('immediate')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${sendType === 'immediate'
                                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                                        : 'border-[#E0E0E0] hover:bg-[#F8F9FA]'
                                    }`}
                            >
                                <Send className={`w-6 h-6 mb-2 ${sendType === 'immediate' ? 'text-[#FF6B35]' : 'text-[#757575]'}`} />
                                <p className={`font-medium ${sendType === 'immediate' ? 'text-[#FF6B35]' : 'text-[#212121]'}`}>
                                    즉시 발송
                                </p>
                                <p className="text-xs text-[#757575] mt-1">지금 바로 발송합니다</p>
                            </button>
                            <button
                                onClick={() => setSendType('scheduled')}
                                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${sendType === 'scheduled'
                                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                                        : 'border-[#E0E0E0] hover:bg-[#F8F9FA]'
                                    }`}
                            >
                                <Clock className={`w-6 h-6 mb-2 ${sendType === 'scheduled' ? 'text-[#FF6B35]' : 'text-[#757575]'}`} />
                                <p className={`font-medium ${sendType === 'scheduled' ? 'text-[#FF6B35]' : 'text-[#212121]'}`}>
                                    예약 발송
                                </p>
                                <p className="text-xs text-[#757575] mt-1">원하는 시간에 발송</p>
                            </button>
                        </div>

                        {sendType === 'scheduled' && (
                            <Input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="h-12"
                            />
                        )}
                    </div>
                </div>

                {/* Right: 미리보기 & 발송 */}
                <div className="space-y-6">
                    {/* 대상 유저 */}
                    <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                        <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#FF6B35]" />
                            발송 대상
                        </h3>
                        {selectedData ? (
                            <div className="text-center py-4">
                                <p className="text-4xl font-bold text-[#FF6B35]">{selectedData.matchedUsers}</p>
                                <p className="text-sm text-[#757575] mt-1">명의 유저에게 발송</p>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-[#757575]">
                                장학금을 선택하세요
                            </div>
                        )}
                    </div>

                    {/* 미리보기 */}
                    <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                        <h3 className="text-lg font-bold text-[#212121] mb-4">미리보기</h3>
                        <div className="bg-[#F8F9FA] rounded-lg p-4 border border-[#E0E0E0]">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center shrink-0">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#212121] text-sm">
                                        {pushTitle || '알림 제목'}
                                    </p>
                                    <p className="text-xs text-[#757575] mt-1 line-clamp-2">
                                        {pushBody || '알림 내용이 여기에 표시됩니다.'}
                                    </p>
                                    <p className="text-xs text-[#BDBDBD] mt-2">지금</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 발송 버튼 */}
                    <Button
                        className="w-full h-12 text-base gap-2"
                        disabled={!selectedScholarship || !pushTitle || !pushBody}
                        onClick={handleSend}
                    >
                        <Send className="w-5 h-5" />
                        {sendType === 'immediate' ? 'PUSH 발송하기' : '예약 발송하기'}
                    </Button>

                    {/* 체크리스트 */}
                    <div className="bg-[#F8F9FA] rounded-lg p-4 text-sm">
                        <p className="font-medium text-[#212121] mb-2">발송 전 체크리스트</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {selectedScholarship ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-[#BDBDBD]" />
                                )}
                                <span className={selectedScholarship ? 'text-[#212121]' : 'text-[#757575]'}>
                                    장학금 선택
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {pushTitle ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-[#BDBDBD]" />
                                )}
                                <span className={pushTitle ? 'text-[#212121]' : 'text-[#757575]'}>
                                    제목 입력
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {pushBody ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-[#BDBDBD]" />
                                )}
                                <span className={pushBody ? 'text-[#212121]' : 'text-[#757575]'}>
                                    본문 입력
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
