'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    GraduationCap,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/scholarships', icon: GraduationCap, label: '장학금 관리' },
    { href: '/admin/notifications', icon: Bell, label: '알림 발송' },
    { href: '/admin/settings', icon: Settings, label: '설정' },
];

/**
 * AdminLayout
 * 관리자 페이지 공통 레이아웃
 * 
 * - 좌측: LNB (사이드바)
 * - 상단: 헤더
 * - Desktop 1440px 기준
 */
export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* LNB (Left Navigation Bar) */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full bg-white border-r border-[#E0E0E0] z-40 transition-all duration-300",
                    isCollapsed ? "w-16" : "w-60"
                )}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[#E0E0E0]">
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#FF6B35]">Scala</span>
                            <span className="text-xs bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded font-medium">Admin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 hover:bg-[#F8F9FA] rounded-lg transition-colors ml-auto"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-[#757575]" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-[#757575]" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                                        : "text-[#757575] hover:bg-[#F8F9FA] hover:text-[#212121]"
                                )}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom: Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#E0E0E0]">
                    <button
                        onClick={() => {
                            localStorage.removeItem('auth_token');
                            window.location.href = '/login';
                        }}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-[#757575] hover:bg-[#F8F9FA] hover:text-[#212121]"
                        )}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium">로그아웃</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    "flex-1 transition-all duration-300",
                    isCollapsed ? "ml-16" : "ml-60"
                )}
            >
                {/* Header */}
                <header className="h-16 bg-white border-b border-[#E0E0E0] sticky top-0 z-30 flex items-center justify-between px-6">
                    <div>
                        <h1 className="text-lg font-bold text-[#212121]">
                            {NAV_ITEMS.find(item =>
                                pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href))
                            )?.label || '대시보드'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-[#757575]">
                            관리자
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
