import { redirect } from 'next/navigation'
import { getAppUser } from '@/lib/auth/permissions'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAppUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.975_0.005_264)]">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
