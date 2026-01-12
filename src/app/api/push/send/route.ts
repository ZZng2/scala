import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendPushNotification } from '@/lib/fcm-admin';

/**
 * 전송 대상 유저 필터링 로직 (PRD 기반)
 */
function isUserEligible(user: any, scholarship: any) {
    // 1. 성적 조건
    if (scholarship.min_gpa !== null) {
        if ((user.avg_gpa || 0) < scholarship.min_gpa) return false;
    }

    // 2. 소득분위 조건
    if (scholarship.max_income_bracket !== null) {
        // 유저 소득분위가 11(미정)이면 필터링 조건이 있는 경우 일단 제외 (보수적 접근)
        if (user.income_bracket === 11 || (user.income_bracket || 0) > scholarship.max_income_bracket) return false;
    }

    // 3. 학년 조건
    if (scholarship.target_grades && scholarship.target_grades.length > 0) {
        if (!scholarship.target_grades.includes(user.grade)) return false;
    }

    // 4. 학과 조건
    if (scholarship.target_departments && scholarship.target_departments.length > 0) {
        if (!scholarship.target_departments.includes(user.department_id)) return false;
    }

    // 5. 지역 조건
    if (scholarship.target_regions && scholarship.target_regions.length > 0) {
        if (!scholarship.target_regions.includes(user.hometown_region)) return false;
    }

    // 6. 특수 조건 (장애, 다자녀, 국가유공자)
    if (scholarship.requires_disability && !user.has_disability) return false;
    if (scholarship.requires_multi_child && !user.is_multi_child_family) return false;
    if (scholarship.requires_national_merit && !user.is_national_merit) return false;

    return true;
}

export async function POST(request: NextRequest) {
    try {
        const { scholarshipId } = await request.json();

        if (!scholarshipId) {
            return NextResponse.json({ error: 'scholarshipId is required' }, { status: 400 });
        }

        // 1. 장학금 정보 조회
        const { data: scholarship, error: sError } = await supabaseAdmin
            .from('scholarships')
            .select('*')
            .eq('id', scholarshipId)
            .single();

        if (sError || !scholarship) {
            return NextResponse.json({ error: 'Scholarship not found' }, { status: 404 });
        }

        // 2. 푸시 알림 대상 유저 조회 (FCM 토큰이 있고 푸시가 켜진 유저)
        // profiles와 조인하여 필터링 조건 확인
        const { data: users, error: uError } = await supabaseAdmin
            .from('users')
            .select(`
        id,
        fcm_token,
        push_enabled,
        user_profiles (
          grade,
          avg_gpa,
          income_bracket,
          department_id,
          hometown_region,
          has_disability,
          is_multi_child_family,
          is_national_merit
        )
      `)
            .not('fcm_token', 'is', null)
            .eq('push_enabled', true);

        if (uError || !users) {
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }

        // 3. 조건에 맞는 유저 필터링
        const eligibleUsers = users.filter((u: any) => {
            const profile = u.user_profiles;
            if (!profile) return false;
            return isUserEligible(profile, scholarship);
        });

        if (eligibleUsers.length === 0) {
            return NextResponse.json({ message: 'No eligible users found' });
        }

        const tokens = eligibleUsers.map((u: any) => u.fcm_token);
        const title = '지원할 수 있는 장학금이 올라왔어요! 🎓';
        const body = `[${scholarship.category === 'tuition' ? '등록금' : scholarship.category === 'living' ? '생활비' : '지원금'}] ${scholarship.title}\n${scholarship.amount_text || '금액 확인하기'}`;

        // 4. FCM 발송
        const { success, failure } = await sendPushNotification(tokens, title, body, scholarshipId);

        // 5. 로그 기록 (Notifications 테이블)
        const notificationLogs = eligibleUsers.map((u: any) => ({
            user_id: u.id,
            scholarship_id: scholarshipId,
            title,
            body,
            sent: true,
            sent_at: new Date().toISOString(),
        }));

        await supabaseAdmin.from('notifications').insert(notificationLogs);

        // 6. 전체 발송 로그 (Push Logs 테이블)
        await supabaseAdmin.from('push_logs').insert({
            scholarship_id: scholarshipId,
            title,
            body,
            target_user_count: eligibleUsers.length,
            sent_at: new Date().toISOString(),
        });

        // 7. 장학금 push_sent 업데이트
        await supabaseAdmin
            .from('scholarships')
            .update({ push_sent: true })
            .eq('id', scholarshipId);

        return NextResponse.json({
            message: 'Push notifications sent successfully',
            targetCount: eligibleUsers.length,
            successCount: success,
            failureCount: failure,
        });
    } catch (error: any) {
        console.error('Push API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
