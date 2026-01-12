import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/users/profile
 * 사용자 프로필 저장/업데이트
 */
export async function POST(request: Request) {
    try {
        const { userId, push_enabled, ...profileData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. users 테이블 업데이트 (push_enabled)
        if (typeof push_enabled !== 'undefined') {
            const { error: userError } = await supabase
                .from('users')
                .update({ push_enabled })
                .eq('id', userId);

            if (userError) {
                console.error('Error updating users table:', userError);
                // 중요하지 않은 에러일 수 있으므로 로그만 남기고 진행하거나 에러 반환
            }
        }

        // 2. user_profiles 테이블 Upsert
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert(
                { user_id: userId, ...profileData },
                { onConflict: 'user_id' }
            )
            .select()
            .single();

        if (error) {
            console.error('Error saving profile:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * GET /api/users/profile
 * 사용자 프로필 조회
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. 프로필 데이터 조회
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        // 2. 사용자 설정 조회 (push_enabled)
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('push_enabled')
            .eq('id', userId)
            .single();

        if (userError) {
            console.error('Error fetching user settings:', userError);
        }

        // 데이터 병합
        const responseData = {
            ...(profile || {}),
            push_enabled: user?.push_enabled ?? true // 기본값 true
        };

        return NextResponse.json({ data: responseData });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
