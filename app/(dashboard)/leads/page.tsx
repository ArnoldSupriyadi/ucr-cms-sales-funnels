import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { LeadTable } from '@/features/leads/components/lead-table'
import type { LeadWithContacts } from '@/types/domain'

export default async function LeadsPage() {
  const [supabase, user] = await Promise.all([createClient(), getAppUser()])
  if (!user) return null

  const { data } = await supabase
    .from('leads')
    .select('*, lead_contacts(*), users(id, name)')
    .order('created_at', { ascending: false })

  const leads = (data ?? []) as LeadWithContacts[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {leads.length.toLocaleString('id-ID')} perusahaan / klien terdaftar
        </p>
      </div>
      <LeadTable
        leads={leads}
        canCreate={user.permissions['leads.create'] === true}
        canDelete={user.permissions['leads.delete'] === true}
      />
    </div>
  )
}
