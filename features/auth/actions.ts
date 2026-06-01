'use server'

import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { parseBrowser, parseOS } from '@/lib/utils/user-agent'

const SESSION_COOKIE = 'ucr-sk'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 hari

export async function createSession(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? ''
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
    headersList.get('x-real-ip') ??
    null

  const sessionKey = crypto.randomUUID()
  const browser = parseBrowser(userAgent)
  const os = parseOS(userAgent)

  // 1. Invalidate semua sesi aktif user ini
  await supabase
    .from('login_logs')
    .update({ is_active: false, logged_out_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('is_active', true)

  // 2. Update session key di users
  await supabase
    .from('users')
    .update({ active_session_key: sessionKey })
    .eq('id', user.id)

  // 3. Buat log baru
  await supabase.from('login_logs').insert({
    user_id: user.id,
    session_key: sessionKey,
    ip_address: ip,
    user_agent: userAgent,
    browser,
    os,
    is_active: true,
  })

  // 4. Set cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const sessionKey = cookieStore.get(SESSION_COOKIE)?.value

  if (user && sessionKey) {
    // Mark log sebagai logged out
    await supabase
      .from('login_logs')
      .update({ is_active: false, logged_out_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('session_key', sessionKey)

    // Clear session key di users
    await supabase
      .from('users')
      .update({ active_session_key: null })
      .eq('id', user.id)
  }

  // Hapus cookie
  cookieStore.delete(SESSION_COOKIE)

  await supabase.auth.signOut()
}
