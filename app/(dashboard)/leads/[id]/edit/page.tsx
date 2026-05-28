import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { LeadForm } from '@/features/leads/components/lead-form'

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getAppUser()
  if (!user?.permissions['leads.edit']) redirect('/leads')

  const supabase = await createClient()
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (!lead) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Lead</h1>
        <p className="text-sm text-slate-500 mt-1">{lead.company_name}</p>
      </div>
      <LeadForm lead={lead} />
    </div>
  )
}
