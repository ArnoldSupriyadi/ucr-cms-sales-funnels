'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLoaForm } from '../loa-form-context'
import { MenuTreeEditor } from './menu-tree-editor'
import { formatDate } from '@/lib/utils/format'
import type { MenuCatalog } from '../types'

export function StepItems({ catalog }: { catalog: MenuCatalog }) {
  const { state } = useLoaForm()
  const { events } = state

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Item Layanan (Menu per Event)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {events.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada event. Tambahkan event di langkah Detail dulu.</p>
        )}
        {events.map((ev, idx) => (
          <div key={ev.key} className="space-y-3">
            <div className="text-sm font-semibold text-slate-700">
              Event {idx + 1}
              {ev.eventDate ? ` — ${formatDate(ev.eventDate)}` : ''}
            </div>
            <MenuTreeEditor event={ev} catalog={catalog} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
