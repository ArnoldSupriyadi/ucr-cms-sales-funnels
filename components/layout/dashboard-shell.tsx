'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Toaster } from '@/components/ui/sonner'
import type { AppUser } from '@/types/domain'

const STORAGE_KEY = 'ucr-sidebar-collapsed'

interface DashboardShellProps {
  user: AppUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setCollapsed(true)
    setMounted(true)
  }, [])

  function toggle() {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.975_0.005_264)]">
      <Sidebar user={user} collapsed={mounted ? collapsed : false} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onToggleSidebar={toggle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
