'use client'

import { useState } from 'react'
import { CheckCircle2, XIcon, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusChangeDialog } from './status-change-dialog'
import { ORDER_STATUS_LABELS } from '@/lib/constants/status'
import type { OrderStatus } from '@/types/domain'
import { cn } from '@/lib/utils'

interface StatusChangeActionsProps {
  orderId: string
  currentStatus: OrderStatus
  nextStatuses: OrderStatus[]
}

// Tombol aksi (bukan label status): kata kerja + icon + warna selaras status
const STATUS_ACTIONS: Partial<
  Record<OrderStatus, { label: string; Icon: LucideIcon; variant: 'default' | 'outline'; className: string }>
> = {
  Definite: { label: 'Jadikan Definite', Icon: CheckCircle2, variant: 'default', className: 'bg-blue-600 hover:bg-blue-700 text-white' },
  Actual: { label: 'Jadikan Actual', Icon: CheckCircle2, variant: 'default', className: 'bg-green-600 hover:bg-green-700 text-white' },
  Cancel: { label: 'Batalkan', Icon: XIcon, variant: 'outline', className: 'border-red-300 text-red-600 hover:bg-red-50' },
}

export function StatusChangeActions({
  orderId,
  currentStatus,
  nextStatuses,
}: StatusChangeActionsProps) {
  const [selected, setSelected] = useState<OrderStatus | null>(null)

  return (
    <>
      <div className="flex items-center gap-2">
        {nextStatuses.map((status) => {
          const action = STATUS_ACTIONS[status]
          const Icon = action?.Icon
          return (
            <Button
              key={status}
              size="sm"
              variant={action?.variant ?? 'default'}
              className={cn('gap-1.5 shadow-sm', action?.className)}
              onClick={() => setSelected(status)}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {action?.label ?? ORDER_STATUS_LABELS[status]}
            </Button>
          )
        })}
      </div>

      {selected && (
        <StatusChangeDialog
          orderId={orderId}
          currentStatus={currentStatus}
          toStatus={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
