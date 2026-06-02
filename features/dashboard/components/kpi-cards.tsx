import { Users, CalendarDays, TrendingUp, UserPlus } from 'lucide-react'

interface KpiCardsProps {
  totalLeads: number
  totalOrders: number
  activeOrders: number
  leadsThisMonth: number
}

interface KpiCardProps {
  label: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function KpiCard({ label, value, icon: Icon, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {value.toLocaleString('id-ID')}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export function KpiCards({ totalLeads, totalOrders, activeOrders, leadsThisMonth }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Leads"
        value={totalLeads}
        icon={Users}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <KpiCard
        label="Total Orders"
        value={totalOrders}
        icon={CalendarDays}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <KpiCard
        label="Order Aktif"
        value={activeOrders}
        icon={TrendingUp}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />
      <KpiCard
        label="Leads Bulan Ini"
        value={leadsThisMonth}
        icon={UserPlus}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />
    </div>
  )
}
