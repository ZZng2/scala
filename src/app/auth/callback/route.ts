import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth Callback Route
 * Supabase OAuth 인증 후 리다이렉트되는 엔드포인트
 * 
 * 처리 순서:
 * 1. Auth Code를 Session으로 교환
 * 2. 온보딩 완료 여부 확인
 * 3. 미완료 시 /onboarding, 완료 시 /home으로 리다이렉트
 */
export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Auth Code를 Session으로 교환
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            console.error('Auth code exchange error:', exchangeError)
            return NextResponse.redirect(`${origin}/login?error=auth_failed&details=${encodeURIComponent(exchangeError.message)}`)
        }

        // 현재 사용자 정보 가져오기
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('Get user error:', userError)
            return NextResponse.redirect(`${origin}/login?error=user_not_found&details=${encodeURIComponent(userError?.message || 'No user data')}`)
        }

        // public.users 테이블에서 온보딩 완료 여부 확인
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

        if (dbError) {
            // users 테이블에 레코드가 없으면 생성
            if (dbError.code === 'PGRST116') {
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: user.id,
                        email: user.email || null, // 카카오는 NULL 가능
                        onboarding_completed: false,
                        last_login_at: new Date().toISOString()
                    })

                if (insertError) {
                    console.error('User insert error:', insertError)
                    return NextResponse.redirect(`${origin}/login?error=insert_failed&details=${encodeURIComponent(insertError.message)}`)
                }

                // 신규 사용자는 무조건 온보딩으로
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            console.error('Database error:', dbError)
            return NextResponse.redirect(`${origin}/login?error=db_error&details=${encodeURIComponent(dbError.message)}`)
        }

        // 온보딩 완료 여부에 따라 리다이렉트
        if (userData?.onboarding_completed) {
            // 마지막 로그인 시간 업데이트
            await supabase
                .from('users')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', user.id)

            return NextResponse.redirect(`${origin}/home`)
        } else {
            return NextResponse.redirect(`${origin}/onboarding`)
        }
    }

    // Code가 없으면 에러
    return NextResponse.redirect(`${origin}/login?error=no_code`)
}
