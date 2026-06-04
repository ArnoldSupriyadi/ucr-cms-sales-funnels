'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, ChevronDown, Menu } from 'lucide-react'
import type { AppUser } from '@/types/domain'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/loa': 'LoA',
  '/leads': 'Leads',
  '/reports': 'Reports',
  '/targets': 'Targets',
  '/master-data/recipes': 'Master Data',
  '/settings/users': 'Settings',
}

interface HeaderProps {
  user: AppUser
  onToggleSidebar?: () => void
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const title =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? ''

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 shrink-0 hover:bg-slate-100"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
        )}
        {title && (
          <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">{title}</h1>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl h-9 px-2 sm:px-3 hover:bg-slate-100 border border-slate-200 shrink-0"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{user.role.name}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <span className="mt-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 ring-1 ring-indigo-200/60">
              {user.role.name}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg mx-1 mb-1"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
