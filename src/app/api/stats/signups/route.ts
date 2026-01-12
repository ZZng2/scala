import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/stats/signups
 * 회원가입 수 조회 (랜딩 페이지 실시간 카운터용)
 */
export async function GET() {
    try {
        const { count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        // 베이스 카운트 13명 + 실제 회원 수
        const totalCount = 13 + (count || 0);

        return NextResponse.json({ count: totalCount });
    } catch (error) {
        console.error('Failed to fetch signup count:', error);
        return NextResponse.json({ count: 13 }, { status: 500 });
    }
}
