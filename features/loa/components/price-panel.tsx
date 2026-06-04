'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRupiah } from '@/lib/utils/format'
import { useLoaForm } from '../loa-form-context'

export function PricePanel() {
  const { calc, state } = useLoaForm()
  const { pricing } = state

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ringkasan Harga</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Row label="Sub Total 1" value={formatRupiah(calc.subTotal1)} muted />
        {pricing.discountEnabled && (
          <div className="flex justify-between py-1.5 text-red-600">
            <span>Diskon</span>
            <span>− {formatRupiah(calc.discountAmt)}</span>
          </div>
        )}
        <Row label={`Service Charge (${pricing.scPct}%)`} value={formatRupiah(calc.serviceChargeAmt)} muted />
        <div className="my-1.5 flex justify-between rounded-md bg-green-50 px-2 py-1.5 font-semibold text-green-700">
          <span>Net Revenue (Sub Total 2)</span>
          <span>{formatRupiah(calc.subTotal2)}</span>
        </div>
        <Row label="PB1 (10%)" value={formatRupiah(calc.pb1Amt)} muted />
        <Row
          label={`Handling (${pricing.handlingType === 'percent' ? `${pricing.handlingValue}%` : 'flat'})`}
          value={formatRupiah(calc.handlingFeeAmt)}
          muted
        />
        <div className="my-2 border-t border-dashed" />
        <div className="flex justify-between pt-1 text-lg font-extrabold">
          <span>GRAND TOTAL</span>
          <span>{formatRupiah(calc.grandTotal)}</span>
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400">
          Diskon memotong dari Sub Total 1; Net Revenue (Sub Total 2) = basis setelah diskon + service charge.
        </p>
      </CardContent>
    </Card>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${muted ? 'text-slate-500' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
