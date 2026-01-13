import { NextResponse } from 'next/server';
import { createClient, createAdminClient, isAdmin } from '@/lib/supabase/server';

/**
 * GET /api/scholarships
 * 장학금 목록 조회
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const isOpen = searchParams.get('isOpen');
        const incomeFree = searchParams.get('income_free');
        const limit = parseInt(searchParams.get('limit') || '100'); // 기본값 50 -> 100 으로 상향 (한번에 많이 볼 수 있게)
        const offset = parseInt(searchParams.get('offset') || '0');

        const supabase = await createClient();

        // 소득 무관 장학금 개수만 반환하는 경우
        if (incomeFree === 'true') {
            const { count, error } = await supabase
                .from('scholarships')
                .select('*', { count: 'exact', head: true })
                .eq('is_closed', false)
                .gte('deadline', new Date().toISOString().split('T')[0])
                .or('max_income_bracket.is.null,max_income_bracket.gte.10');

            if (error) {
                console.error('Error counting income-free scholarships:', error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ count: count || 0 });
        }

        let query = supabase
            .from('scholarships')
            .select('*')
            .order('deadline', { ascending: true })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq('category', category);
        }

        if (isOpen === 'true') {
            query = query.eq('is_closed', false).gte('deadline', new Date().toISOString().split('T')[0]);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching scholarships:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/scholarships
 * 장학금 등록 (Admin)
 */
export async function POST(request: Request) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('scholarships')
            .insert(body)
            .select()
            .single();

        if (error) {
            console.error('Error creating scholarship:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/scholarships
 * 장학금 대량 삭제 (Admin)
 */
export async function DELETE(request: Request) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid IDs provided' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { error } = await supabase
            .from('scholarships')
            .delete()
            .in('id', ids);

        if (error) {
            console.error('Error bulk deleting scholarships:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
