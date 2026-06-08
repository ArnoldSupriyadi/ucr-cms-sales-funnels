'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { searchMenuItems } from '@/lib/loa/catalog-suggest'
import type { MenuCatalog } from '../types'

/**
 * Input nama menu bebas-ketik dengan saran dari katalog (dropdown ringan, tanpa portal).
 * Dipakai di editor pohon (bukan di dalam Sheet) → aman dari masalah scroll RemoveScroll.
 */
export function ItemCombobox({
  value,
  onChange,
  catalog,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  catalog: MenuCatalog
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const suggestions = useMemo(
    () => searchMenuItems(catalog, value).filter((s) => s.toLowerCase() !== value.trim().toLowerCase()),
    [catalog, value],
  )
  const show = focused && suggestions.length > 0

  return (
    <div className="relative w-full">
      <Input
        value={value}
        placeholder={placeholder ?? 'Nama makanan/minuman'}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
      />
      {show && (
        <div className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="block w-full px-3 py-1.5 text-left text-sm hover:bg-muted"
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(s)
                setFocused(false)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
