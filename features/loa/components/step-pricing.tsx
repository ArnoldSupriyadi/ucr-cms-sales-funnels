'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLoaForm } from '../loa-form-context'

export function StepPricing() {
  const { state, dispatch } = useLoaForm()
  const { pricing } = state

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pengaturan Harga</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Service Charge (%)</Label>
            <Input type="number" value={pricing.scPct} readOnly className="bg-slate-50 text-slate-500" />
            <p className="text-[11px] text-slate-400">mengikuti Tipe Order · read-only</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">PB1 (%)</Label>
            <Input type="number" value={10} readOnly className="bg-slate-50 text-slate-500" />
            <p className="text-[11px] text-slate-400">fixed 10% · read-only</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-xs text-slate-500">Handling Fee</Label>
          <RadioGroup
            value={pricing.handlingType}
            onValueChange={(v) => dispatch({ type: 'SET_PRICING_FIELD', field: 'handlingType', value: v })}
            className="flex gap-5"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="percent" /> Percent (%)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="flat" /> Flat (Rp)
            </label>
          </RadioGroup>
          <Input type="number" value={pricing.handlingValue}
            onChange={(e) => dispatch({ type: 'SET_PRICING_FIELD', field: 'handlingValue', value: Number(e.target.value) })} />
          <p className="text-[11px] text-slate-400">
            {pricing.handlingType === 'percent' ? '% dari Sub Total 2' : 'nilai Rupiah langsung'} · default 15%
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Checkbox
              checked={pricing.discountEnabled}
              onCheckedChange={(c) => dispatch({ type: 'TOGGLE_DISCOUNT', on: c === true })}
            />
            Pakai diskon?
          </label>
          <p className="mb-2.5 mt-1 text-[11px] text-slate-400">
            Default mati. Bila dimatikan, baris diskon hilang dari ringkasan &amp; dokumen.
          </p>

          {pricing.discountEnabled && (
            <div className="space-y-2.5">
              <RadioGroup
                value={pricing.discountType}
                onValueChange={(v) => dispatch({ type: 'SET_PRICING_FIELD', field: 'discountType', value: v })}
                className="flex gap-5"
              >
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="percent" /> Percent (%)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value="flat" /> Flat (Rp)
                </label>
              </RadioGroup>
              <Input type="number" value={pricing.discountValue}
                onChange={(e) => dispatch({ type: 'SET_PRICING_FIELD', field: 'discountValue', value: Number(e.target.value) })} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
