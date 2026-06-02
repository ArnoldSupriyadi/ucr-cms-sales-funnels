'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Target,
  Database,
  Settings,
} from 'lucide-react'
import type { AppUser, Permissions } from '@/types/domain'

const NAV_GROUPS: {
  label: string
  items: {
    href: string
    label: string
    icon: React.ElementType
    permission: keyof Permissions | null
  }[]
}[] = [
  {
    label: 'MAIN MENU',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
      { href: '/orders',    label: 'Orders',    icon: CalendarDays,    permission: null },
      { href: '/leads',     label: 'Leads',     icon: Users,           permission: null },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { href: '/reports',               label: 'Reports',     icon: BarChart3, permission: 'reports.view' },
      { href: '/targets',               label: 'Targets',     icon: Target,    permission: 'targets.manage' },
      { href: '/master-data/recipes',   label: 'Master Data', icon: Database,  permission: 'master_data.manage' },
      { href: '/settings/users',        label: 'Settings',    icon: Settings,  permission: 'users.manage' },
    ],
  },
]

interface SidebarProps {
  user: AppUser
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100 px-5">
        <Image
          src="/logo-umara.png"
          alt="PT Umara Cipta Rasa"
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-xl object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.permission) return true
            return user.permissions[item.permission] === true
          })
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-4">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          active ? 'text-indigo-600' : 'text-gray-400'
                        )}
                      />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-100 p-3">
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="truncate text-[11px] text-gray-400">{user.role.name}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
