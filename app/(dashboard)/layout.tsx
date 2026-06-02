import { redirect } from 'next/navigation'
import { getAppUser } from '@/lib/auth/permissions'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAppUser()
  if (!user) redirect('/login')

  return <DashboardShell user={user}>{children}</DashboardShell>
}
