'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ORDER_STATUS_LABELS } from '@/lib/constants/status'
import { changeOrderStatus } from '../actions'
import type { OrderStatus } from '@/types/domain'

interface StatusChangeDialogProps {
  orderId: string
  currentStatus: OrderStatus
  toStatus: OrderStatus
  open: boolean
  onClose: () => void
}

export function StatusChangeDialog({
  orderId,
  currentStatus,
  toStatus,
  open,
  onClose,
}: StatusChangeDialogProps) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const requireNote = toStatus === 'Cancel'

  async function handleConfirm() {
    if (requireNote && !note.trim()) return
    setLoading(true)

    const result = await changeOrderStatus(orderId, toStatus, note || undefined)
    if (!result.success) {
      toast.error('Gagal ubah status', { description: result.error })
    } else {
      toast.success(
        `Status diubah ke ${ORDER_STATUS_LABELS[toStatus]}`
      )
      onClose()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Status Order</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-3">
          <p className="text-sm text-slate-600">
            Mengubah status dari{' '}
            <strong>{ORDER_STATUS_LABELS[currentStatus]}</strong> ke{' '}
            <strong>{ORDER_STATUS_LABELS[toStatus]}</strong>.
          </p>
          <div className="space-y-2">
            <Label>
              Catatan {requireNote ? <span className="text-red-500">*</span> : '(opsional)'}
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={
                requireNote
                  ? 'Wajib: alasan pembatalan'
                  : 'Catatan perubahan status (opsional)'
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (requireNote && !note.trim())}
            className={toStatus === 'Cancel' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {loading ? 'Memproses...' : `Ubah ke ${ORDER_STATUS_LABELS[toStatus]}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
