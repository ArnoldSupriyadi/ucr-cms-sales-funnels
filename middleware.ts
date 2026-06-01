import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const SESSION_COOKIE = 'ucr-sk'

export async function middleware(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Public routes — tidak perlu auth
  if (pathname.startsWith('/login') || pathname.startsWith('/api/loa/approve')) {
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/orders', request.url))
    }
    return supabaseResponse
  }

  // Belum login → redirect ke login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validasi session key (single-session enforcement)
  const cookieSessionKey = request.cookies.get(SESSION_COOKIE)?.value

  if (!cookieSessionKey) {
    await supabase.auth.signOut()
    const url = new URL('/login', request.url)
    url.searchParams.set('reason', 'session_expired')
    return NextResponse.redirect(url)
  }

  // Query DB — gunakan maybeSingle agar tidak error jika row belum ada
  const { data: userData } = await supabase
    .from('users')
    .select('active_session_key, is_active')
    .eq('id', user.id)
    .maybeSingle()

  // Jika row tidak ada di tabel users, biarkan lewat (bisa terjadi saat setup awal)
  if (userData === null) {
    return supabaseResponse
  }

  if (userData.is_active === false) {
    await supabase.auth.signOut()
    const url = new URL('/login', request.url)
    url.searchParams.set('reason', 'account_disabled')
    return NextResponse.redirect(url)
  }

  if (userData.active_session_key !== cookieSessionKey) {
    await supabase.auth.signOut()
    const response = NextResponse.redirect(new URL('/login', request.url))
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
