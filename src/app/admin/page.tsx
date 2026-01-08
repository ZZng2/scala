'use client';

import React, { useEffect, useState } from 'react';
import { MetricsCard, SimpleChart } from '@/components/admin';
import { Users, MousePointerClick, AlertCircle, Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AdminDashboardPage
 * Feature 6: 관리자 대시보드
 * 
 * - MAU, CTR, Empty State 비율 등 핵심 지표
 * - 일별 가입자 차트
 * - PUSH 클릭률 차트
 */
export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/dashboard/stats');
                const json = await res.json();
                if (!res.ok) throw new Error(json.error);
                setData(json);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
                const errorMessage = error instanceof Error ? error.message : '대시보드 데이터를 불러오지 못했습니다.';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
            </div>
        );
    }

    if (!data) return null;

    const { metrics, charts, recentActivity } = data;

    // Time formatter
    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return '방금 전';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        return `${Math.floor(diffInSeconds / 86400)}일 전`;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <p className="text-[#757575]">서비스 현황을 한눈에 확인하세요.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsCard
                    title="총 사용자"
                    value={metrics.totalUsers.toLocaleString()}
                    change={metrics.todaySignups > 0 ? metrics.todaySignups : 0}
                    changeLabel="오늘 가입"
                    icon={<Users className="w-5 h-5" />}
                />
                <MetricsCard
                    title="총 PUSH 발송"
                    value={metrics.totalPushSent.toLocaleString()}
                    change={0}
                    icon={<Bell className="w-5 h-5" />}
                />
                {/* Placeholder metrics for now */}
                <MetricsCard
                    title="PUSH 클릭률 (CTR)"
                    value="-"
                    change={0}
                    icon={<MousePointerClick className="w-5 h-5" />}
                    description="데이터 수집 중"
                />
                <MetricsCard
                    title="Empty State 비율"
                    value="-"
                    change={0}
                    icon={<AlertCircle className="w-5 h-5" />}
                    description="데이터 수집 중"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SimpleChart
                    title="일별 신규 가입자 (최근 7일)"
                    data={charts.dailySignups}
                    type="line"
                    color="#FF6B35"
                />
                {/* Placeholder Chart */}
                <SimpleChart
                    title="주간 PUSH 클릭률 (%)"
                    data={[]}
                    type="bar"
                    color="#4CAF50"
                    emptyMessage="아직 데이터가 충분하지 않습니다."
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm">
                <h3 className="text-lg font-bold text-[#212121] mb-4">최근 활동</h3>
                <div className="space-y-3">
                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-4 py-2 border-b border-[#F8F9FA] last:border-0">
                                <span className="text-sm text-[#757575] w-20 shrink-0">{formatTimeAgo(item.time)}</span>
                                <span className="text-sm font-medium text-[#212121] w-32 shrink-0">{item.action}</span>
                                <span className="text-sm text-[#757575] truncate">{item.detail}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-[#757575] py-4 text-center">최근 활동 내역이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
