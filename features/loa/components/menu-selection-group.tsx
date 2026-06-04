'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { filterCategoriesByQuery } from '@/lib/loa/filter-categories'
import type { CatalogCategory } from '../types'

/** Palet aksen dirotasi per index occasion → tiap sesi beda warna, deterministik. */
const ACCENTS = [
  { head: 'bg-indigo-50 text-indigo-700', ring: 'border-indigo-100' },
  { head: 'bg-emerald-50 text-emerald-700', ring: 'border-emerald-100' },
  { head: 'bg-amber-50 text-amber-700', ring: 'border-amber-100' },
  { head: 'bg-sky-50 text-sky-700', ring: 'border-sky-100' },
  { head: 'bg-rose-50 text-rose-700', ring: 'border-rose-100' },
]

interface MenuSelectionGroupProps {
  componentName: string
  occasionNo: number
  /** true bila komponen punya >1 occasion (qty>1) → tampilkan "Sesi N". */
  showOccasion: boolean
  categories: CatalogCategory[]
  /** key = categoryId (leaf), value = id item terpilih */
  value: Record<string, string[]>
  onChange: (categoryId: string, itemIds: string[]) => void
  /** categoryId leaf yang belum memenuhi aturan */
  errorIds?: Set<string>
  /** index occasion untuk pilih warna aksen (deterministik) */
  accentIndex: number
}

export function MenuSelectionGroup({
  componentName,
  occasionNo,
  showOccasion,
  categories,
  value,
  onChange,
  errorIds,
  accentIndex,
}: MenuSelectionGroupProps) {
  const [query, setQuery] = useState('')
  const accent = ACCENTS[accentIndex % ACCENTS.length]
  const visible = filterCategoriesByQuery(categories, query)
  let lastGroup: string | null | undefined = undefined

  return (
    <div className={cn('overflow-hidden rounded-xl border', accent.ring)}>
      <div className={cn('px-3 py-2 text-sm font-bold', accent.head)}>
        {componentName}
        {showOccasion && <span className="font-medium opacity-70"> — Sesi {occasionNo}</span>}
      </div>

      <div className="space-y-2.5 bg-white p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu di sesi ini..."
            className="h-8 pl-8 text-[13px]"
          />
        </div>

        {visible.length === 0 ? (
          <p className="py-2 text-center text-[12px] text-slate-400">Tidak ada menu cocok.</p>
        ) : (
          visible.map((cat) => {
            const showHeader = cat.groupName !== lastGroup && !!cat.groupName
            lastGroup = cat.groupName
            const selected = value[cat.id] ?? []
            const hasError = errorIds?.has(cat.id)

            return (
              <div key={cat.id}>
                {showHeader && (
                  <div className="mt-2 mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {cat.groupName}
                  </div>
                )}

                <div
                  className={cn(
                    'rounded-md px-2 py-1.5',
                    hasError && 'bg-destructive/5 ring-1 ring-destructive/30'
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                    {cat.nama}
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        cat.rule === 'one' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      )}
                    >
                      {cat.rule === 'one' ? 'pilih 1' : 'pilih bebas'}
                    </span>
                  </div>

                  {cat.rule === 'one' ? (
                    <RadioGroup
                      value={selected[0] ?? ''}
                      onValueChange={(v) => onChange(cat.id, [v])}
                      className="mt-1.5 grid grid-cols-2 gap-1.5"
                    >
                      {cat.items.map((item) => {
                        const on = selected[0] === item.id
                        return (
                          <Label
                            key={item.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] font-normal transition-colors',
                              on
                                ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-800'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            )}
                          >
                            <RadioGroupItem value={item.id} />
                            {item.nama}
                          </Label>
                        )
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {cat.items.map((item) => {
                        const checked = selected.includes(item.id)
                        return (
                          <Label
                            key={item.id}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] font-normal transition-colors',
                              checked
                                ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-800'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) =>
                                onChange(
                                  cat.id,
                                  c ? [...selected, item.id] : selected.filter((id) => id !== item.id)
                                )
                              }
                            />
                            {item.nama}
                          </Label>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
