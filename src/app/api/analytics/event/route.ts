import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/analytics/event
 * 클릭 이벤트 기록
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, eventType, scholarshipId, pushLogId, metadata } = body;

        if (!eventType) {
            return NextResponse.json({ error: 'eventType is required' }, { status: 400 });
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('click_events')
            .insert({
                user_id: userId || null,
                event_type: eventType,
                scholarship_id: scholarshipId || null,
                push_log_id: pushLogId || null,
                metadata: metadata || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error logging event:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
