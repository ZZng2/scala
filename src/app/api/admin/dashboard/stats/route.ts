import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        // 1. Check Session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Metrics
        // 2.1 Total Users
        const { count: totalUsers } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // 2.2 Total Push Sent (using push_logs)
        const { count: totalPushSent } = await supabase
            .from('push_logs')
            .select('*', { count: 'exact', head: true });

        // 2.3 Daily Signups (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const { data: recentUsers } = await supabase
            .from('users')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: true });

        // Add today's users to recent activity later
        const todayUsersCount = recentUsers?.filter(u => {
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
        const { data: recentScholarships } = await supabase
            .from('scholarships')
            .select('title, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        // 2.4.2 Recent Pushes
        const { data: recentPushes } = await supabase
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
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
