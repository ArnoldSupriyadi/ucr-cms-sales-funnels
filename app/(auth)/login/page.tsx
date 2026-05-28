'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ChefHat, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Login gagal', { description: error.message })
      setLoading(false)
      return
    }

    router.push('/bookings')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/30 mb-4">
          <ChefHat className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Umara Catering</h1>
        <p className="text-sm text-slate-500 mt-1">Sales Funnel Dashboard</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@umara.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Masuk...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        PT Umara Cipta Rasa © 2026
      </p>
    </div>
  )
}
