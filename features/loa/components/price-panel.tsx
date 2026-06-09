'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRupiah } from '@/lib/utils/format'
import { useLoaForm } from '../loa-form-context'

export function PricePanel() {
  const { calc, state } = useLoaForm()
  const { pricing } = state

  return (
    <Card className="sticky top-6 border-indigo-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-indigo-700">
          <span className="h-4 w-1.5 rounded bg-gradient-to-b from-indigo-500 to-violet-500" />
          Ringkasan Harga
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Row label="Sub Total 1" value={formatRupiah(calc.subTotal1)} />
        {pricing.discountEnabled && <Row label="Diskon" value={'− ' + formatRupiah(calc.discountAmt)} tone="red" />}
        <Row label={`Service Charge (${pricing.scPct}%)`} value={formatRupiah(calc.serviceChargeAmt)} tone="amber" />
        <Row label="Sub Total 2" value={formatRupiah(calc.subTotal2)} strong />
        <Row label="PB1 (10%)" value={formatRupiah(calc.pb1Amt)} tone="sky" />
        <Row
          label={`Handling (${pricing.handlingType === 'percent' ? `${pricing.handlingValue}%` : 'flat'})`}
          value={formatRupiah(calc.handlingFeeAmt)}
          tone="violet"
        />
        <div className="mt-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-white shadow-md">
          <span className="text-sm font-semibold">GRAND TOTAL</span>
          <span className="text-lg font-extrabold">{formatRupiah(calc.grandTotal)}</span>
        </div>
        <p className="mt-2.5 text-[11px] text-slate-400">
          Diskon memotong dari Sub Total 1; Sub Total 2 = setelah diskon + service charge (basis PB1 &amp; Handling).
        </p>
      </CardContent>
    </Card>
  )
}

const toneMap = {
  red: 'text-red-600',
  amber: 'text-amber-700',
  sky: 'text-sky-700',
  violet: 'text-violet-700',
} as const

function Row({ label, value, tone, strong }: { label: string; value: string; tone?: keyof typeof toneMap; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${strong ? 'mt-0.5 border-t border-slate-200 font-semibold text-slate-800' : ''}`}>
      <span className={tone ? toneMap[tone] : 'text-slate-500'}>{label}</span>
      <span className={strong ? 'font-semibold text-slate-900' : ''}>{value}</span>
    </div>
  )
}
