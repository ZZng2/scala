'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Save, Database, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AdminSettingsPage
 * 관리자 설정 페이지
 */
export default function AdminSettingsPage() {
    const [supabaseUrl, setSupabaseUrl] = useState('https://xxxxx.supabase.co');
    const [supabaseKey, setSupabaseKey] = useState('eyJhbGci...');
    const [fcmKey, setFcmKey] = useState('');
    const [pushEnabled, setPushEnabled] = useState(true);

    const handleSave = () => {
        toast.success('설정이 저장되었습니다.');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <p className="text-[#757575]">서비스 설정을 관리합니다.</p>
            </div>

            {/* Supabase 설정 */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#FF6B35]" />
                    Supabase 연결
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-[#212121] mb-2 block">Project URL</label>
                        <Input
                            value={supabaseUrl}
                            onChange={(e) => setSupabaseUrl(e.target.value)}
                            placeholder="https://xxxxx.supabase.co"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-[#212121] mb-2 block">Anon Key</label>
                        <Input
                            type="password"
                            value={supabaseKey}
                            onChange={(e) => setSupabaseKey(e.target.value)}
                            placeholder="eyJhbGci..."
                        />
                    </div>
                </div>
            </div>

            {/* FCM 설정 */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#FF6B35]" />
                    Firebase Cloud Messaging
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-[#212121] mb-2 block">Server Key</label>
                        <Input
                            type="password"
                            value={fcmKey}
                            onChange={(e) => setFcmKey(e.target.value)}
                            placeholder="FCM Server Key"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                        <div>
                            <p className="font-medium text-[#212121]">PUSH 알림 활성화</p>
                            <p className="text-sm text-[#757575]">전체 PUSH 알림 발송 On/Off</p>
                        </div>
                        <button
                            onClick={() => setPushEnabled(!pushEnabled)}
                            className={cn(
                                "w-12 h-7 rounded-full transition-colors relative",
                                pushEnabled ? "bg-[#FF6B35]" : "bg-[#E0E0E0]"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform",
                                pushEnabled ? "translate-x-5" : "translate-x-0.5"
                            )} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 보안 설정 */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#FF6B35]" />
                    보안
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                        <div>
                            <p className="font-medium text-[#212121]">관리자 비밀번호 변경</p>
                            <p className="text-sm text-[#757575]">마지막 변경: 2026년 1월 1일</p>
                        </div>
                        <Button variant="outline">변경</Button>
                    </div>
                </div>
            </div>

            {/* 저장 버튼 */}
            <Button className="gap-2" onClick={handleSave}>
                <Save className="w-4 h-4" />
                설정 저장
            </Button>
        </div>
    );
}
