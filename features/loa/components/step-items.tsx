'use client'

import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils/format'
import { groupSelectionLines } from '@/lib/loa/menu-detail-lines'
import { useLoaForm } from '../loa-form-context'
import { MenuDrawer } from './menu-drawer'
import type { MenuCatalog } from '../types'

export function StepItems({ catalog }: { catalog: MenuCatalog }) {
  const { state, dispatch } = useLoaForm()
  const { items } = state

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Item Layanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada item. Klik tombol di bawah.</p>
        )}
        {items.map((it) => {
          const lines = groupSelectionLines(it.selections)
          return (
            <div key={it.key} className="rounded-lg border px-4 py-3.5">
              <div className="flex items-start justify-between">
                <div className="text-[13px]">
                  <div className="font-semibold">{it.packageName}</div>
                  <div className="text-slate-500">{it.pax} pax × {formatRupiah(it.pricePerPax)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold whitespace-nowrap">{formatRupiah(it.pax * it.pricePerPax)}</div>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center gap-1 text-[13px] text-slate-400 hover:text-red-600"
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', key: it.key })}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> hapus
                  </button>
                </div>
              </div>
              {lines.length > 0 && (
                <div className="mt-2 space-y-2">
                  {lines.map((ln, idx) => (
                    <div key={idx}>
                      <div className="text-[12px] font-semibold text-slate-700">{ln.group}</div>
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-5 text-[12px] text-slate-600 marker:text-slate-300">
                        {ln.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        <MenuDrawer
          catalog={catalog}
          onAddItem={(item) => dispatch({ type: 'ADD_ITEM', item })}
          trigger={
            <Button variant="outline" className="w-full border-dashed text-indigo-600">
              + Tambah Item
            </Button>
          }
        />
      </CardContent>
    </Card>
  )
}
