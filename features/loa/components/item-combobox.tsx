'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { searchMenuItems, searchItemsInCategory } from '@/lib/loa/catalog-suggest'
import type { MenuCatalog } from '../types'

/**
 * Input nama menu bebas-ketik dengan saran dari katalog (dropdown ringan, tanpa portal).
 * Bila `categoryName` diisi (nama Jenis Menu, mis. "Beef"), saran difokuskan ke item kategori itu
 * (fokus tanpa ketik → tampil semua item kategori). Tanpa kategori → saran global.
 */
export function ItemCombobox({
  value,
  onChange,
  catalog,
  categoryName,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  catalog: MenuCatalog
  categoryName?: string
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  const scoped = !!categoryName && searchItemsInCategory(catalog, categoryName, '').length > 0
  const suggestions = useMemo(
    () =>
      (scoped
        ? searchItemsInCategory(catalog, categoryName!, value)
        : searchMenuItems(catalog, value)
      ).filter((s) => s.toLowerCase() !== value.trim().toLowerCase()),
    [catalog, categoryName, scoped, value],
  )
  const show = focused && suggestions.length > 0

  return (
    <div className="relative w-full">
      <Input
        value={value}
        placeholder={placeholder ?? (scoped ? `Pilih/ketik item ${categoryName}` : 'Nama makanan/minuman')}
        onChange={(e) => {
          onChange(e.target.value)
          setFocused(true) // mengetik = input fokus; jaga sinkron agar dropdown muncul lagi setelah memilih lalu menghapus
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
      />
      {show && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
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
