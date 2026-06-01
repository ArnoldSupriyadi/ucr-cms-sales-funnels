'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  CalendarDays,
  Users,
  BarChart3,
  Target,
  Database,
  Settings,
  ChefHat,
} from 'lucide-react'
import type { AppUser } from '@/types/domain'

const navItems = [
  {
    href: '/orders',
    label: 'Orders',
    icon: CalendarDays,
    permission: null,
  },
  {
    href: '/leads',
    label: 'Leads',
    icon: Users,
    permission: null,
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: BarChart3,
    permission: 'reports.view' as const,
  },
  {
    href: '/targets',
    label: 'Targets',
    icon: Target,
    permission: 'targets.manage' as const,
  },
  {
    href: '/master-data/recipes',
    label: 'Master Data',
    icon: Database,
    permission: 'master_data.manage' as const,
  },
  {
    href: '/settings/users',
    label: 'Settings',
    icon: Settings,
    permission: 'users.manage' as const,
  },
]

interface SidebarProps {
  user: AppUser
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true
    return user.permissions[item.permission] === true
  })

  return (
    <aside className="flex h-full w-60 flex-col bg-[oklch(0.175_0.045_264)] text-slate-200">

      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">Umara</p>
          <p className="text-[10px] text-slate-400 -mt-0.5">Sales Funnel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        {visibleItems.map((item) => {
          const Icon = item.icon
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon className={cn('h-4.5 w-4.5', active ? 'text-white' : 'text-slate-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-slate-400">{user.role.name}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
