'use client';

import React from 'react';

interface SimpleChartProps {
    title: string;
    data: { label: string; value: number }[];
    color?: string;
    type?: 'bar' | 'line';
}

/**
 * SimpleChart
 * 간단한 바/라인 차트 컴포넌트
 * (실제 서비스에서는 recharts 사용 권장)
 */
export function SimpleChart({ title, data, color = '#FF6B35', type = 'bar' }: SimpleChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white rounded-xl p-6 border border-[#E0E0E0] shadow-sm">
            <h3 className="text-lg font-bold text-[#212121] mb-6">{title}</h3>

            {type === 'bar' ? (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#757575]">{item.label}</span>
                                <span className="font-medium text-[#212121]">{item.value.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${(item.value / maxValue) * 100}%`,
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-48 flex items-end justify-between gap-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full rounded-t-sm transition-all duration-500"
                                style={{
                                    height: `${(item.value / maxValue) * 100}%`,
                                    backgroundColor: color,
                                    minHeight: '4px',
                                }}
                            />
                            <span className="text-xs text-[#757575] truncate w-full text-center">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
