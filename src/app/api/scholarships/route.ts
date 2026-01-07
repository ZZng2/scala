import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * GET /api/scholarships
 * 장학금 목록 조회
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const isOpen = searchParams.get('isOpen');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const supabase = createServerClient();

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
        const body = await request.json();
        const supabase = createServerClient();

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
