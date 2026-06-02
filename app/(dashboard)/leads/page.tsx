import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { LeadsClient } from '@/features/leads/components/leads-client'
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
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {leads.length.toLocaleString('id-ID')} perusahaan / klien terdaftar
        </p>
      </div>
      <LeadsClient
        leads={leads}
        canCreate={user.permissions['leads.create'] === true}
        canEdit={user.permissions['leads.edit'] === true}
        canDelete={user.permissions['leads.delete'] === true}
      />
    </div>
  )
}
