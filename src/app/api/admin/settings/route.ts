import { NextResponse } from 'next/server';
import { createAdminClient, isAdmin } from '@/lib/supabase/server';

export async function GET() {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const supabase = createAdminClient();

        const { data } = await supabase
            .from('admin_settings')
            .select('value')
            .eq('key', 'push_enabled')
            .single();

        const pushEnabled = data?.value ?? true;

        // 환경변수 상태 확인
        const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
        const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const hasSupabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

        // 실제 사용되는 키는 FIREBASE_SERVICE_ACCOUNT_KEY (JSON 문자열)
        const hasFcmKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        return NextResponse.json({
            supabase: {
                connected: hasSupabaseUrl && hasSupabaseAnonKey && hasSupabaseServiceKey,
                url: process.env.NEXT_PUBLIC_SUPABASE_URL || ''
            },
            fcm: {
                configured: hasFcmKey
            },
            pushEnabled
        });
    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        const body = await request.json();
        const { pushEnabled } = body;

        const supabase = createAdminClient();

        const { error } = await supabase
            .from('admin_settings')
            .upsert({
                key: 'push_enabled',
                value: pushEnabled,
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
