'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import type { CatalogPackage } from '../types'

interface PackageComboboxProps {
  /** Paket dikelompokkan per kategori: [kategori, paket[]][] */
  packagesByKategori: [string, CatalogPackage[]][]
  value: string
  onChange: (id: string) => void
  /** Node portal popover. Diisi node di dalam Sheet agar wheel-scroll list tak diblokir RemoveScroll. */
  container?: HTMLElement | null
}

/**
 * Picker paket ber-search (Popover + Command). Popover di-portal ke dalam Sheet
 * (via `container`) supaya wheel-scroll list jalan & tetap tak terpotong.
 * Menggantikan Select shadcn.
 */
export function PackageCombobox({ packagesByKategori, value, onChange, container }: PackageComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = packagesByKategori
    .flatMap(([, pkgs]) => pkgs)
    .find((p) => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', !selected && 'text-slate-400')}
        >
          <span className="truncate">{selected ? selected.namaPaket : 'Pilih paket...'}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" container={container}>
        <Command>
          <CommandInput placeholder="Cari paket..." />
          <CommandList>
            <CommandEmpty>Paket tidak ditemukan.</CommandEmpty>
            {packagesByKategori.map(([kategori, pkgs]) => (
              <CommandGroup key={kategori} heading={kategori}>
                {pkgs.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={`${p.namaPaket} ${kategori}`}
                    onSelect={() => {
                      onChange(p.id)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === p.id ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex-1 truncate">{p.namaPaket}</span>
                    {p.hasSelection && <span className="ml-1 text-[11px] text-green-600">●</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
