'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

/**
 * LoginPage
 * Feature 4: 로그인 페이지
 */
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMagicLink = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                console.error('Magic link error:', error);
                alert('이메일 전송에 실패했습니다.');
            } else {
                setIsSent(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKakaoLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                console.error('Kakao login error:', error);
                alert('카카오 로그인에 실패했습니다.');
                setIsLoading(false);
            }
            // 성공 시 카카오 페이지로 리다이렉트됨
        } catch (err) {
            console.error('Unexpected error:', err);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                console.error('Google login error:', error);
                alert('구글 로그인에 실패했습니다.');
                setIsLoading(false);
            }
            // 성공 시 구글 페이지로 리다이렉트됨
        } catch (err) {
            console.error('Unexpected error:', err);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#FF6B35] mb-2">Scala</h1>
                    <p className="text-[#757575]">동국대 맞춤 장학금 알림</p>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#212121] mb-2">
                        로그인
                    </h2>
                </div>

                {isSent ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.69a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-[#212121] mb-2">이메일을 확인해주세요!</h3>
                        <p className="text-[#757575] text-sm mb-4">
                            {email}로 로그인 링크를 보냈어요.<br />
                            링크를 클릭하면 자동으로 로그인됩니다.
                        </p>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-[#FF6B35] font-medium text-sm"
                        >
                            다른 이메일로 로그인하기
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Social Login Buttons - Moved to Top */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handleKakaoLogin}
                                disabled={isLoading}
                                className="w-full h-12 bg-[#FEE500] text-[#191919] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10 3C5.58172 3 2 5.79086 2 9.2C2 11.3036 3.33333 13.1464 5.4 14.2L4.6 17.4C4.55279 17.5889 4.66667 17.8 4.86667 17.8667C4.97333 17.9 5.08667 17.8667 5.17333 17.8L9.06667 15.2667C9.37333 15.3 9.68 15.3333 10 15.3333C14.4183 15.3333 18 12.5425 18 9.13333C18 5.79086 14.4183 3 10 3Z"
                                        fill="#191919"
                                    />
                                </svg>
                                {isLoading ? '로그인 중...' : '카카오로 로그인'}
                            </button>

                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full h-12 bg-white border border-[#E0E0E0] text-[#212121] font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#F8F9FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M18.1711 8.36791H17.5V8.33334H10V11.6667H14.7096C14.0225 13.6071 12.1762 15 10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C11.2741 5 12.4346 5.48084 13.3171 6.26625L15.6742 3.90917C14.1858 2.52209 12.195 1.66667 10 1.66667C5.39792 1.66667 1.66667 5.39792 1.66667 10C1.66667 14.6021 5.39792 18.3333 10 18.3333C14.6021 18.3333 18.3333 14.6021 18.3333 10C18.3333 9.44125 18.2758 8.89584 18.1711 8.36791Z"
                                        fill="#FFC107"
                                    />
                                    <path
                                        d="M2.62744 6.12125L5.36536 8.12917C6.10619 6.29501 7.90036 5 10 5C11.2741 5 12.4346 5.48084 13.3171 6.26625L15.6742 3.90917C14.1858 2.52209 12.195 1.66667 10 1.66667C6.79911 1.66667 4.02328 3.47375 2.62744 6.12125Z"
                                        fill="#FF3D00"
                                    />
                                    <path
                                        d="M10 18.3333C12.1525 18.3333 14.1083 17.5096 15.5871 16.17L13.0079 13.9875C12.1431 14.6452 11.0864 15.0009 10 15C7.83252 15 5.99211 13.6179 5.29877 11.6892L2.58127 13.7829C3.96043 16.4817 6.76127 18.3333 10 18.3333Z"
                                        fill="#4CAF50"
                                    />
                                    <path
                                        d="M18.1711 8.36791H17.5V8.33334H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3333 14.1667 18.3333 10C18.3333 9.44125 18.2758 8.89584 18.1711 8.36791Z"
                                        fill="#1976D2"
                                    />
                                </svg>
                                {isLoading ? '로그인 중...' : 'Google로 로그인'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-[#E0E0E0]" />
                            <span className="text-sm text-[#757575]">또는</span>
                            <div className="flex-1 h-px bg-[#E0E0E0]" />
                        </div>

                        {/* Email Input - Moved to Bottom */}
                        <div className="space-y-4 mb-6">
                            <Input
                                type="email"
                                placeholder="이메일 주소"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 text-base"
                            />
                            <Button
                                className="w-full h-12 text-base"
                                onClick={handleMagicLink}
                                disabled={!email.includes('@')}
                            >
                                이메일로 로그인 링크 받기
                            </Button>
                        </div>

                        {/* Signup Link */}
                        <div className="text-center">
                            <span className="text-[#757575] text-sm">계정이 없으신가요? </span>
                            <Link href="/signup" className="text-[#FF6B35] font-medium text-sm">
                                회원가입
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
