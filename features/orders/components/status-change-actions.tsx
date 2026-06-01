'use client'

import { useState } from 'react'
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

const STATUS_BUTTON_STYLES: Partial<Record<OrderStatus, string>> = {
  Definite: 'bg-blue-600 hover:bg-blue-700 text-white',
  Actual: 'bg-green-600 hover:bg-green-700 text-white',
  Cancel: 'border-red-300 text-red-600 hover:bg-red-50',
}

export function StatusChangeActions({
  orderId,
  currentStatus,
  nextStatuses,
}: StatusChangeActionsProps) {
  const [selected, setSelected] = useState<OrderStatus | null>(null)

  return (
    <>
      <div className="flex gap-2">
        {nextStatuses.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={status === 'Cancel' ? 'outline' : 'default'}
            className={cn(STATUS_BUTTON_STYLES[status])}
            onClick={() => setSelected(status)}
          >
            {ORDER_STATUS_LABELS[status]}
          </Button>
        ))}
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
