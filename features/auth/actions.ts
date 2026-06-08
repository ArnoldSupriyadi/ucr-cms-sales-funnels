'use server'

import { cookies, headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { parseBrowser, parseOS } from '@/lib/utils/user-agent'

const SESSION_COOKIE = 'ucr-sk'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 8 // 8 jam (sesi berakhir 8 jam setelah login → wajib login ulang)

export async function createSession(tokens?: {
  access_token: string
  refresh_token: string
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await createClient()

    // Baca sesi dari cookie Supabase yang dikirim browser setelah signInWithPassword.
    // Tidak menggunakan getUser(jwt) karena proxy bisa memanggil signOut() sebelum
    // Server Action ini jalan, menyebabkan session_id di JWT sudah tidak aktif.
    const { data, error: sessionErr } = await supabase.auth.getUser()
    if (sessionErr || !data.user) {
      throw new Error('Sesi tidak ditemukan. Silakan login ulang.')
    }
    const user = data.user

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
    const { error: err1 } = await supabase
      .from('login_logs')
      .update({ is_active: false, logged_out_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (err1) {
      throw new Error(`Gagal mengupdate sesi lama: ${err1.message}`)
    }

    // 2. Update session key di users
    const { error: err2 } = await supabase
      .from('users')
      .update({ active_session_key: sessionKey })
      .eq('id', user.id)

    if (err2) {
      throw new Error(`Gagal mengupdate session key: ${err2.message}`)
    }

    // 3. Buat log baru
    const { error: err3 } = await supabase.from('login_logs').insert({
      user_id: user.id,
      session_key: sessionKey,
      ip_address: ip,
      user_agent: userAgent,
      browser,
      os,
      is_active: true,
    })

    if (err3) {
      throw new Error(`Gagal mencatat log login: ${err3.message}`)
    }

    // 4. Set cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, sessionKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: '/',
    })

    return { success: true }
  } catch (err: any) {
    console.error('CRITICAL ERROR in createSession:', err)
    return {
      success: false,
      error: err.message || 'Terjadi kesalahan sistem saat masuk.',
    }
  }
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
