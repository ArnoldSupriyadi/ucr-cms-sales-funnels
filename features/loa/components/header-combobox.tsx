'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { searchPackages, packageComponentsSummary } from '@/lib/loa/catalog-suggest'
import type { MenuCatalog } from '../types'

/**
 * Input nama Header: ketik bebas + saran dari nama paket kategori "Meeting Package"
 * (Full Day Meeting, Coffee Break, Half Day, Canape, ...). Memilih hanya mengisi nama.
 */
export function HeaderCombobox({
  value,
  onChange,
  catalog,
}: {
  value: string
  onChange: (v: string) => void
  catalog: MenuCatalog
}) {
  const [focused, setFocused] = useState(false)
  const suggestions = useMemo(
    () => searchPackages(catalog, value, 'Meeting Package').filter((s) => s.toLowerCase() !== value.trim().toLowerCase()),
    [catalog, value],
  )
  const show = focused && suggestions.length > 0
  // Panduan komponen paket (read-only) — muncul bila nama header cocok paket berkomponen,
  // dan saat dropdown saran tidak terbuka agar tidak tabrakan.
  const componentsHint = useMemo(() => packageComponentsSummary(catalog, value), [catalog, value])

  return (
    <div className="relative w-full">
      <Input
        value={value}
        placeholder="Nama header (ketik/pilih, mis. Full Day Meeting Package)"
        className="border-indigo-200 bg-white font-semibold focus-visible:ring-indigo-400"
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
      {!show && componentsHint && (
        <div className="hint-blink mt-1 flex items-center gap-2 rounded-md bg-indigo-50/70 p-2 text-[14px] leading-snug text-[#D51C39]">
          <span className="font-semibold">Termasuk:</span>
          <span>{componentsHint}</span>
        </div>
      )}
    </div>
  )
}
