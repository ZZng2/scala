
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Database, Bell, Shield, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AdminSettingsPage
 * 관리자 설정 페이지
 * - 환경변수 상태 확인 (Supabase, FCM)
 * - PUSH 알림 On/Off 설정
 */
export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({
        supabase: { connected: false, url: '' },
        fcm: { configured: false },
        pushEnabled: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSettings(data);
        } catch (error) {
            console.error(error);
            toast.error('설정을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePushToggle = async () => {
        const newState = !settings.pushEnabled;
        // 낙관적 업데이트
        setSettings(prev => ({ ...prev, pushEnabled: newState }));

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pushEnabled: newState })
            });

            if (!res.ok) throw new Error('저장 실패');

            toast.success(newState ? 'PUSH 알림이 활성화되었습니다.' : 'PUSH 알림이 비활성화되었습니다.');
        } catch (error) {
            // 롤백
            setSettings(prev => ({ ...prev, pushEnabled: !newState }));
            toast.error('설정 저장에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <p className="text-[#757575]">서비스 설정을 관리합니다.</p>
                <Button variant="outline" size="sm" onClick={fetchSettings} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    상태 새로고침
                </Button>
            </div>

            {/* Supabase 설정 (Read Only) */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#FF6B35]" />
                    Supabase 연결
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-[#212121] mb-2 block">Project URL</label>
                        <div className="flex items-center gap-2 p-3 bg-[#F8F9FA] rounded-lg border border-[#E0E0E0]">
                            <span className="flex-1 text-[#757575] font-mono text-sm">
                                {settings.supabase.url || 'Not Configured'}
                            </span>
                            {settings.supabase.connected ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-red-600 text-xs font-medium px-2 py-1 bg-red-50 rounded-full">
                                    <XCircle className="w-3 h-3" />
                                    Disconnected
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-[#9E9E9E]">
                            * Supabase 연결 설정은 환경변수(.env)에서 관리됩니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* FCM 설정 */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
                <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#FF6B35]" />
                    알림 설정
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg">
                        <div>
                            <p className="font-medium text-[#212121]">FCM 서버 연결</p>
                            <p className="text-sm text-[#757575] mt-0.5">Google Firebase Cloud Messaging</p>
                        </div>
                        {settings.fcm.configured ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                설정됨
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                미설정
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-[#E0E0E0] rounded-lg">
                        <div>
                            <p className="font-medium text-[#212121]">PUSH 알림 활성화</p>
                            <p className="text-sm text-[#757575]">전체 PUSH 알림 발송을 제어합니다.</p>
                        </div>
                        <button
                            onClick={handlePushToggle}
                            className={cn(
                                "w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35]",
                                settings.pushEnabled ? "bg-[#FF6B35]" : "bg-[#E0E0E0]"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200",
                                settings.pushEnabled ? "translate-x-5" : "translate-x-0.5"
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
                            <p className="text-sm text-[#757575]">Supabase Auth 대시보드에서 관리해주세요.</p>
                        </div>
                        <Button variant="outline" asChild>
                            <a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noopener noreferrer">
                                대시보드 이동
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
