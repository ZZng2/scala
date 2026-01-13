import { createAdminClient, isAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {


    // 환경변수 체크
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Critical Error: SUPABASE_SERVICE_ROLE_KEY is missing');
        return NextResponse.json({ error: 'Server Configuration Error: Service Role Key missing' }, { status: 500 });
    }

    try {
        // 1. Check Admin Role
        if (!await isAdmin()) {
            console.warn('Unauthorized Admin Access Attempt');
            return NextResponse.json({
                error: 'Forbidden: Admin access only',
                message: '관리자 권한이 없습니다.'
            }, { status: 403 });
        }

        const adminClient = createAdminClient();



        // 2. Fetch Metrics (Using Admin Client to bypass RLS)
        // 2.1 Total Users
        const { count: totalUsers } = await adminClient
            .from('users')
            .select('*', { count: 'exact', head: true });

        // 2.2 Total Push Sent (using push_logs)
        const { count: totalPushSent } = await adminClient
            .from('push_logs')
            .select('*', { count: 'exact', head: true });

        // 2.3 Daily Signups (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const { data: recentUsers } = await adminClient
            .from('users')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        // Add today's users to recent activity later
        const todayUsersCount = recentUsers?.filter(u => {
            if (!u.created_at) return false;
            const d = new Date(u.created_at);
            const today = new Date();
            return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
        }).length || 0;

        // Group by Date for Chart
        const dailySignupsMap = new Map<string, number>();
        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
            dailySignupsMap.set(dateStr, 0);
        }

        recentUsers?.forEach(user => {
            if (!user.created_at) return;
            const date = new Date(user.created_at);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            if (dailySignupsMap.has(dateStr)) {
                dailySignupsMap.set(dateStr, (dailySignupsMap.get(dateStr) || 0) + 1);
            }
        });

        const dailySignups = Array.from(dailySignupsMap.entries())
            .map(([label, value]) => ({ label, value }))
            .reverse(); // Oldest first

        // 2.4 Recent Activity (Mixed Logs)
        // 2.4.1 Recent Scholarships
        const { data: recentScholarships } = await adminClient
            .from('scholarships')
            .select('title, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        // 2.4.2 Recent Pushes
        const { data: recentPushes } = await adminClient
            .from('push_logs')
            .select('title, sent_at, target_user_count')
            .order('sent_at', { ascending: false })
            .limit(3);

        // Combine and sort
        const activities = [
            ...(recentScholarships?.map(s => ({
                type: 'scholarship',
                action: '새 장학금 등록',
                detail: s.title,
                time: s.created_at
            })) || []),
            ...(recentPushes?.map(p => ({
                type: 'push',
                action: 'PUSH 발송 완료',
                detail: `대상: ${p.target_user_count}명`,
                time: p.sent_at
            })) || [])
        ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
            .slice(0, 5); // Start with top 5

        return NextResponse.json({
            metrics: {
                totalUsers: totalUsers || 0,
                totalPushSent: totalPushSent || 0,
                todaySignups: todayUsersCount
            },
            charts: {
                dailySignups
            },
            recentActivity: activities
        });

    } catch (error: any) {
        console.error('Dashboard Stats API Error:', error);
        return NextResponse.json({
            error: `Internal Server Error: ${error.message}`,
            details: error.toString()
        }, { status: 500 });
    }
}
