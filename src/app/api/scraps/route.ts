import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/scraps
 * 사용자의 스크랩 목록 조회
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('scraps')
            .select(`
        id,
        created_at,
        scholarship:scholarships (
          id,
          title,
          category,
          amount_text,
          deadline,
          is_closed
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching scraps:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/scraps
 * 장학금 스크랩 추가
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, scholarshipId } = body;

        if (!userId || !scholarshipId) {
            return NextResponse.json({ error: 'userId and scholarshipId are required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 스크랩 추가
        const { data, error } = await supabase
            .from('scraps')
            .insert({ user_id: userId, scholarship_id: scholarshipId })
            .select()
            .single();

        if (error) {
            // 이미 스크랩된 경우
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Already scrapped' }, { status: 409 });
            }
            console.error('Error adding scrap:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 장학금 스크랩 수 증가
        // @ts-ignore
        await supabase.rpc('increment_scraps', { scholarship_id: scholarshipId }).catch(() => { });

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/scraps
 * 스크랩 삭제
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const scholarshipId = searchParams.get('scholarshipId');

        if (!userId || !scholarshipId) {
            return NextResponse.json({ error: 'userId and scholarshipId are required' }, { status: 400 });
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from('scraps')
            .delete()
            .eq('user_id', userId)
            .eq('scholarship_id', scholarshipId);

        if (error) {
            console.error('Error deleting scrap:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 장학금 스크랩 수 감소
        // @ts-ignore
        await supabase.rpc('decrement_scraps', { scholarship_id: scholarshipId }).catch(() => { });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
