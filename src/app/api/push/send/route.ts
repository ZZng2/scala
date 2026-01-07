import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * POST /api/push/send
 * PUSH 알림 발송 (Admin)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scholarshipId, title, body: pushBody, scheduledAt } = body;

        if (!title || !pushBody) {
            return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
        }

        const supabase = createServerClient();

        // 1. 대상 유저 조회 (PUSH 활성화 + FCM 토큰 있는 유저)
        let matchedUsers;

        if (scholarshipId) {
            // 장학금에 맞는 유저 매칭 (간단 버전)
            const { data: users } = await supabase
                .from('users')
                .select('id, fcm_token')
                .eq('push_enabled', true)
                .not('fcm_token', 'is', null);

            matchedUsers = users || [];
        } else {
            // 전체 발송
            const { data: users } = await supabase
                .from('users')
                .select('id, fcm_token')
                .eq('push_enabled', true)
                .not('fcm_token', 'is', null);

            matchedUsers = users || [];
        }

        // 2. PUSH 로그 기록
        const { data: pushLog, error: logError } = await supabase
            .from('push_logs')
            .insert({
                scholarship_id: scholarshipId || null,
                title,
                body: pushBody,
                target_user_count: matchedUsers.length,
                sent_at: scheduledAt || new Date().toISOString(),
            })
            .select()
            .single();

        if (logError) {
            console.error('Error creating push log:', logError);
            return NextResponse.json({ error: logError.message }, { status: 500 });
        }

        // 3. FCM 발송 (TODO: 실제 FCM 연동)
        // 여기서는 Mock 응답
        console.log(`[PUSH] Sending to ${matchedUsers.length} users`);
        console.log(`[PUSH] Title: ${title}`);
        console.log(`[PUSH] Body: ${pushBody}`);

        // 실제 FCM 발송은 아래와 같이 구현:
        // const fcmResults = await Promise.all(
        //   matchedUsers.map(user => sendFCM(user.fcm_token, { title, body: pushBody }))
        // );

        return NextResponse.json({
            success: true,
            pushLogId: pushLog.id,
            targetCount: matchedUsers.length,
            message: scheduledAt ? `예약 발송 설정 완료 (${scheduledAt})` : '즉시 발송 완료',
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * GET /api/push/logs
 * PUSH 발송 이력 조회
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('push_logs')
            .select(`
        *,
        scholarship:scholarships (
          id,
          title
        )
      `)
            .order('sent_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching push logs:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
