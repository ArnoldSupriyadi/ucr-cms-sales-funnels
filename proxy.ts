import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SESSION_COOKIE = 'ucr-sk'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Server Actions (Next-Action header) hanya perlu session refresh, tidak perlu cek ucr-sk
  const isServerAction = request.headers.has('next-action')

  // 1. Cek autentikasi Supabase
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 2. Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/loa/approve')) {
    // Jangan redirect Server Action — biarkan createSession/clearSession jalan
    if (!isServerAction && user && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // 3. Belum login → redirect ke login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. Single session check — validasi session key
  const cookieSessionKey = request.cookies.get(SESSION_COOKIE)?.value

  if (!cookieSessionKey) {
    // Tidak ada session key cookie → session tidak valid
    // scope: 'local' — hanya revoke session ini, bukan semua session user
    await supabase.auth.signOut({ scope: 'local' })
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('reason', 'session_expired')
    return NextResponse.redirect(redirectUrl)
  }

  // Query DB untuk bandingkan session key
  const { data: userData } = await supabase
    .from('users')
    .select('active_session_key, is_active')
    .eq('id', user.id)
    .single()

  if (!userData?.is_active) {
    // Akun dinonaktifkan
    await supabase.auth.signOut({ scope: 'local' })
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('reason', 'account_disabled')
    return NextResponse.redirect(redirectUrl)
  }

  if (userData?.active_session_key !== cookieSessionKey) {
    // Session key tidak cocok → ada login baru dari device lain
    await supabase.auth.signOut({ scope: 'local' })
    const response = NextResponse.redirect(new URL('/login', request.url))
    // Hapus cookie lama
    response.cookies.delete(SESSION_COOKIE)
    response.cookies.set('ucr-kicked', '1', { maxAge: 10, path: '/' })
    return response
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
