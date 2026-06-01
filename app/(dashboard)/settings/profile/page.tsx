import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { ProfileForm } from '@/features/settings/components/profile-form'
import { LoginHistory } from '@/features/settings/components/login-history'
import type { LoginLog } from '@/types/domain'

export default async function ProfilePage() {
  const [user, supabase] = await Promise.all([getAppUser(), createClient()])
  if (!user) redirect('/login')

  const { data: logs } = await supabase
    .from('login_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_in_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profil Saya</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola informasi profil dan kontak kamu</p>
      </div>
      <ProfileForm user={user} />
      <LoginHistory logs={(logs ?? []) as LoginLog[]} />
    </div>
  )
}
