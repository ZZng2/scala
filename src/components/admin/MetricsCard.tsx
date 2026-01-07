'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricsCardProps {
    title: string;
    value: string | number;
    change?: number; // 전월 대비 변화율 (%)
    icon?: React.ReactNode;
    description?: string;
}

/**
 * MetricsCard
 * 대시보드 핵심 지표 카드
 */
export function MetricsCard({ title, value, change, icon, description }: MetricsCardProps) {
    const getTrendIcon = () => {
        if (change === undefined) return null;
        if (change > 0) return <TrendingUp className="w-4 h-4" />;
        if (change < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (change === undefined) return 'text-[#757575]';
        if (change > 0) return 'text-green-600';
        if (change < 0) return 'text-red-500';
        return 'text-[#757575]';
    };

    return (
        <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-[#757575]">{title}</span>
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
                        {icon}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-3xl font-bold text-[#212121]">{value}</p>

                {change !== undefined && (
                    <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                        {getTrendIcon()}
                        <span>{change > 0 ? '+' : ''}{change}%</span>
                        <span className="text-[#757575] ml-1">전월 대비</span>
                    </div>
                )}

                {description && (
                    <p className="text-sm text-[#757575]">{description}</p>
                )}
            </div>
        </div>
    );
}
