import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase Client (Browser)
 * 클라이언트 사이드에서 사용
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * 서버 사이드에서 사용할 Supabase Admin Client
 * Service Role Key 필요
 */
export function createServerClient() {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
