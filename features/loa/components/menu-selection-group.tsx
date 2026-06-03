'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CatalogCategory } from '../types'

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
}

export function MenuSelectionGroup({
  componentName,
  occasionNo,
  showOccasion,
  categories,
  value,
  onChange,
  errorIds,
}: MenuSelectionGroupProps) {
  let lastGroup: string | null | undefined = undefined

  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-2 text-sm font-bold text-slate-800">
        {componentName}
        {showOccasion && <span className="text-slate-500"> — Sesi {occasionNo}</span>}
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => {
          const showHeader = cat.groupName !== lastGroup && !!cat.groupName
          const headerChanged = cat.groupName !== lastGroup
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
              {!cat.groupName && headerChanged && <div className="mt-1" />}

              <div
                className={cn(
                  'rounded-md px-2 py-1.5 transition-colors',
                  hasError && 'bg-destructive/5 ring-1 ring-destructive/30'
                )}
              >
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
                  {cat.nama}
                  <span
                    className={cn(
                      'text-[11px] font-normal',
                      cat.rule === 'one' ? 'text-blue-600' : 'text-purple-600'
                    )}
                  >
                    {cat.rule === 'one' ? '· pilih 1' : '· pilih bebas'}
                  </span>
                </div>

                {cat.rule === 'one' ? (
                  <RadioGroup
                    value={selected[0] ?? ''}
                    onValueChange={(v) => onChange(cat.id, [v])}
                    className="mt-1.5 grid-cols-2"
                  >
                    {cat.items.map((item) => (
                      <Label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-2 text-[13px] font-normal text-slate-600"
                      >
                        <RadioGroupItem value={item.id} />
                        {item.nama}
                      </Label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {cat.items.map((item) => {
                      const checked = selected.includes(item.id)
                      return (
                        <Label
                          key={item.id}
                          className="flex cursor-pointer items-center gap-2 text-[13px] font-normal text-slate-600"
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
        })}
      </div>
    </div>
  )
}
