'use client'

import type { ElementType } from 'react'
import { Users, CalendarDays, TrendingUp, UserPlus, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface KpiCardsProps {
  totalLeads: number
  totalOrders: number
  activeOrders: number
  leadsThisMonth: number
}

interface KpiCardProps {
  label: string
  value: number
  tooltip: string
  icon: ElementType
  iconBg: string
  iconColor: string
}

function KpiCard({ label, value, tooltip, icon: Icon, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 shrink-0 cursor-help text-gray-300 hover:text-gray-400 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-center text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {value.toLocaleString('id-ID')}
          </p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export function KpiCards({ totalLeads, totalOrders, activeOrders, leadsThisMonth }: KpiCardsProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Leads"
          value={totalLeads}
          tooltip="Jumlah seluruh leads (prospek klien) yang terdaftar di sistem."
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          label="Total Orders"
          value={totalOrders}
          tooltip="Jumlah seluruh order yang pernah dibuat, termasuk yang sudah selesai atau dibatalkan."
          icon={CalendarDays}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          label="Order Aktif"
          value={activeOrders}
          tooltip="Order yang sedang berjalan — status Tentative, Definite, atau Actual. Tidak termasuk yang Cancel."
          icon={TrendingUp}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <KpiCard
          label="Leads Bulan Ini"
          value={leadsThisMonth}
          tooltip="Jumlah leads baru yang ditambahkan sejak awal bulan ini sampai hari ini."
          icon={UserPlus}
          iconBg="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>
    </TooltipProvider>
  )
}
