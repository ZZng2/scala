import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * POST /api/users/profile
 * 사용자 프로필 저장/업데이트
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, ...profileData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const supabase = createServerClient();

        // Upsert 프로필
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

        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // 프로필 없으면 null 반환
            if (error.code === 'PGRST116') {
                return NextResponse.json({ data: null });
            }
            console.error('Error fetching profile:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
