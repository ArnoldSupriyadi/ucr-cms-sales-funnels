'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { createSession } from '@/features/auth/actions'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'session_expired') toast.error('Sesi berakhir', { description: 'Silakan login kembali.' })
    if (reason === 'account_disabled') toast.error('Akun dinonaktifkan', { description: 'Hubungi Super Admin.' })
    if (document.cookie.includes('ucr-kicked=1')) {
      toast.warning('Login dari perangkat lain', { description: 'Sesi kamu di perangkat ini telah diakhiri.' })
      document.cookie = 'ucr-kicked=; max-age=0; path=/'
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const msg = error.message.toLowerCase()

      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        toast.error('Login gagal', {
          description: 'Email atau password yang kamu masukkan salah.',
        })
      } else if (msg.includes('email not confirmed')) {
        toast.error('Email belum diverifikasi', {
          description: 'Silakan verifikasi email kamu terlebih dahulu.',
        })
      } else if (msg.includes('too many requests') || msg.includes('rate limit')) {
        toast.error('Terlalu banyak percobaan', {
          description: 'Tunggu beberapa menit sebelum mencoba lagi.',
        })
      } else if (msg.includes('network') || msg.includes('fetch')) {
        toast.error('Gagal terhubung', {
          description: 'Periksa koneksi internet kamu dan coba lagi.',
        })
      } else {
        toast.error('Login gagal', { description: error.message })
      }

      setLoading(false)
      return
    }

    // is_active dicek di proxy dan getAppUser — tidak perlu round trip ekstra di client
    try {
      let result
      if (data?.session) {
        result = await createSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      } else {
        result = await createSession()
      }

      if (result && !result.success) {
        toast.error('Gagal membuat sesi', {
          description: result.error,
        })
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error('Gagal membuat sesi', {
        description: err.message || 'Terjadi kesalahan sistem saat masuk.',
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel (Form) ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h2 className="mb-1.5 text-[30px] font-semibold text-[#1d2939]">Sign In</h2>
          <p className="mb-8 text-sm text-[#667085]">
            Masukkan email dan password untuk masuk!
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#344054]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="info@umara.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-3.5 text-sm text-[#1d2939] placeholder-[#667085] outline-none transition focus:border-[#465fff] focus:ring-2 focus:ring-[#465fff]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#344054]">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-3.5 pr-11 text-sm text-[#1d2939] placeholder-[#667085] outline-none transition focus:border-[#465fff] focus:ring-2 focus:ring-[#465fff]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] transition hover:text-[#344054]"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <Eye className="h-4 w-4" />
                    : <EyeOff className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>

            {/* Keep logged in + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer select-none items-center gap-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#d0d5dd] bg-white checked:border-[#465fff] checked:bg-[#465fff] focus:outline-none"
                  />
                  <svg
                    className="pointer-events-none absolute left-[2px] top-[2px] hidden h-3 w-3 text-white peer-checked:block"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-[#344054]">Tetap masuk</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-[#465fff] hover:underline"
              >
                Lupa password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#465fff] text-sm font-semibold text-white transition hover:bg-[#3651e8] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-[#667085]">
            PT Umara Cipta Rasa &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* ── Right Panel (Branding) ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center"
        style={{ backgroundColor: '#161950' }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Corner accent squares */}
        <div className="absolute -left-6 -top-6 h-40 w-40 rounded-2xl bg-white/5" />
        <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-2xl bg-white/5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 p-3 shadow-xl shadow-black/20">
            <Image
              src="/logo-umara.png"
              alt="PT Umara Cipta Rasa"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <h3 className="mb-2 text-2xl font-semibold text-white">
            PT Umara Cipta Rasa
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-[#8b92c0]">
            Sales Funnel Dashboard — Monitor pipeline, laporan, dan performa tim sales.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.975_0.005_264)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-sm text-slate-500">Memuat halaman masuk...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
