import { redirect } from 'next/navigation'
import { getAppUser } from '@/lib/auth/permissions'
import { LeadForm } from '@/features/leads/components/lead-form'

export default async function NewLeadPage() {
  const user = await getAppUser()
  if (!user?.permissions['leads.create']) redirect('/leads')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Lead</h1>
        <p className="text-sm text-slate-500 mt-1">Daftarkan perusahaan / klien baru</p>
      </div>
      <LeadForm />
    </div>
  )
}
