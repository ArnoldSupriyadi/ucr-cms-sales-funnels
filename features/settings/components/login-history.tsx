import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Monitor, Smartphone, Globe } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/format'
import type { LoginLog } from '@/types/domain'

interface LoginHistoryProps {
  logs: LoginLog[]
}

function DeviceIcon({ os }: { os: string | null }) {
  if (!os) return <Globe className="h-4 w-4 text-slate-400" />
  const mobile = /Android|iOS/.test(os)
  return mobile
    ? <Smartphone className="h-4 w-4 text-slate-400" />
    : <Monitor className="h-4 w-4 text-slate-400" />
}

export function LoginHistory({ logs }: LoginHistoryProps) {
  if (logs.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Riwayat Login</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 px-6 py-3">
              <DeviceIcon os={log.os} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800">
                    {log.browser ?? 'Browser Tidak Diketahui'}
                  </span>
                  {log.os && (
                    <span className="text-xs text-slate-400">· {log.os}</span>
                  )}
                  {log.ip_address && (
                    <span className="text-xs text-slate-400">· {log.ip_address}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDateTime(log.logged_in_at)}
                  {log.logged_out_at && (
                    <span> → Logout {formatDateTime(log.logged_out_at)}</span>
                  )}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  log.is_active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 text-xs'
                }
              >
                {log.is_active ? 'Aktif' : 'Selesai'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
