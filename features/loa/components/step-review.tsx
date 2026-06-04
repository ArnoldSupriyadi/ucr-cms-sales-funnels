'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils/format'
import { generateMenuDetail } from '@/lib/loa/menu-detail'
import { saveLoaDraft } from '../actions'
import { useLoaForm } from '../loa-form-context'

export function StepReview() {
  const { state, calc, meta, orderId } = useLoaForm()
  const { items } = state
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const res = await saveLoaDraft(orderId, state)
    if (res.success) {
      toast.success('Draft LoA tersimpan', { description: res.data.doc_no })
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
          <p className="font-semibold">Item ({items.length}):</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {items.length === 0 && <li className="text-slate-400">—</li>}
            {items.map((i) => (
              <li key={i.key}>
                {i.packageName} — {i.pax} pax × {formatRupiah(i.pricePerPax)} ={' '}
                <b>{formatRupiah(i.pax * i.pricePerPax)}</b>
                {i.selections.length > 0 && (
                  <div className="text-[12px] text-slate-500">{generateMenuDetail(i.selections)}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <p>
          <b>Grand Total: {formatRupiah(calc.grandTotal)}</b> · Net Revenue: {formatRupiah(calc.netRevenue)}
        </p>
        <div className="flex gap-2.5 pt-2">
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => router.push(`/orders/${orderId}`)}
          >
            Batal
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            disabled={saving || items.length === 0}
            onClick={handleSave}
          >
            {saving ? 'Menyimpan…' : '💾 Simpan Draft'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
