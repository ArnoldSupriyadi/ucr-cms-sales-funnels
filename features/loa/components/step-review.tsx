'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah, formatDate } from '@/lib/utils/format'
import { saveLoaDraft } from '../actions'
import { useLoaForm } from '../loa-form-context'

export function StepReview() {
  const { state, calc, meta, orderId } = useLoaForm()
  const { events } = state
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const headerCount = events.reduce((n, e) => n + e.headers.length, 0)
  const canSave = headerCount > 0

  async function handleSave() {
    setSaving(true)
    const res = await saveLoaDraft(orderId, state)
    if (res.success) {
      toast.success('Draft LOA tersimpan', { description: res.data.doc_no })
      router.refresh()
    } else {
      toast.error('Gagal menyimpan', { description: res.error })
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Review &amp; Simpan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          <b>Order:</b> {meta.orderNo} · <b>Klien:</b> {meta.client.name}
        </p>
        <div>
          <p className="font-semibold">
            {events.length} event · {headerCount} header
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {events.length === 0 && <li className="text-slate-400">—</li>}
            {events.map((ev, idx) => (
              <li key={ev.key}>
                Event {idx + 1}
                {ev.eventDate ? ` (${formatDate(ev.eventDate)})` : ''}: {ev.headers.length} header —{' '}
                {formatRupiah(ev.headers.reduce((s, h) => s + h.amount, 0))}
              </li>
            ))}
          </ul>
        </div>
        <p>
          <b>Grand Total: {formatRupiah(calc.grandTotal)}</b> · Net Revenue: {formatRupiah(calc.netRevenue)}
        </p>
        <div className="flex gap-2.5 pt-2">
          <Button variant="outline" disabled={saving} onClick={() => router.push(`/orders/${orderId}`)}>
            Batal
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            disabled={saving || !canSave}
            onClick={handleSave}
          >
            {saving ? 'Menyimpan…' : '💾 Simpan Draft'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
