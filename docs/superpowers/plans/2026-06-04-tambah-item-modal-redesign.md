# Redesign Modal "Tambah Item LoA" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) atau superpowers:executing-plans untuk implementasi task-by-task. Step pakai checkbox (`- [ ]`).

**Goal:** Redesign UI modal "Tambah Item LoA" — picker paket ber-search (fix dropdown terpotong), search menu per-sesi, input full width, tampilan lebih berwarna.

**Architecture:** Ganti `Select` shadcn (terpotong di dalam `Sheet`) dengan `PackageCombobox` baru berbasis `Popover`+`Command` (popper/portal). Tambah helper murni `filterCategoriesByQuery` untuk search menu per-sesi. Sentuh hanya UI + 1 helper; logika simpan/kalkulasi/skema DB tidak berubah.

**Tech Stack:** Next.js 16, React, shadcn/ui (Popover, Command, Sheet), cmdk, Vitest, TypeScript.

**Spec:** `docs/superpowers/specs/2026-06-04-tambah-item-modal-redesign.md`

---

## Catatan Konvensi

- Tipe katalog di `features/loa/types.ts`: `CatalogCategory { id, componentType, nama, rule: 'one'|'multiple', groupName: string|null, items: {id,nama}[] }`, `CatalogPackage { id, namaPaket, kategori, hargaPerPax, hargaMinimum, hasSelection, components[] }`.
- Komponen UI ada: `@/components/ui/popover`, `@/components/ui/command` (CommandInput/List/Empty/Group/Item), `@/components/ui/button`, `@/components/ui/input`, `@/components/ui/radio-group`, `@/components/ui/checkbox`, `@/components/ui/label`.
- Tes `*.test.ts` bersebelahan dengan sumber. Jalankan: `npx vitest run <path>`.
- Typecheck: `npx tsc --noEmit` (abaikan error stale `.next/`).

---

## Task 1: Helper `filterCategoriesByQuery` (TDD)

**Files:**
- Create: `lib/loa/filter-categories.ts`
- Test: `lib/loa/filter-categories.test.ts`

- [ ] **Step 1: Tulis tes yang gagal**

Create `lib/loa/filter-categories.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { filterCategoriesByQuery } from './filter-categories'
import type { CatalogCategory } from '@/features/loa/types'

const cats: CatalogCategory[] = [
  {
    id: 'snack', componentType: 'cb', nama: 'Snack', rule: 'one', groupName: null,
    items: [{ id: 'a', nama: 'Risoles' }, { id: 'b', nama: 'Pastel' }],
  },
  {
    id: 'main', componentType: 'lunch', nama: 'Main Course', rule: 'multiple', groupName: null,
    items: [{ id: 'c', nama: 'Ayam Bakar' }, { id: 'd', nama: 'Gurame' }],
  },
]

describe('filterCategoriesByQuery', () => {
  it('query kosong → kategori utuh', () => {
    expect(filterCategoriesByQuery(cats, '')).toEqual(cats)
    expect(filterCategoriesByQuery(cats, '   ')).toEqual(cats)
  })
  it('match sebagian nama item, case-insensitive', () => {
    const r = filterCategoriesByQuery(cats, 'ris')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('snack')
    expect(r[0].items).toEqual([{ id: 'a', nama: 'Risoles' }])
  })
  it('kategori tanpa match dibuang', () => {
    const r = filterCategoriesByQuery(cats, 'ayam')
    expect(r).toHaveLength(1)
    expect(r[0].id).toBe('main')
    expect(r[0].items).toEqual([{ id: 'c', nama: 'Ayam Bakar' }])
  })
  it('query tak cocok sama sekali → array kosong', () => {
    expect(filterCategoriesByQuery(cats, 'zzz')).toEqual([])
  })
  it('tidak memutasi kategori asli', () => {
    filterCategoriesByQuery(cats, 'ris')
    expect(cats[0].items).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Jalankan — pastikan gagal** — `npx vitest run lib/loa/filter-categories.test.ts`. Expected: FAIL (modul belum ada).

- [ ] **Step 3: Implementasi**

Create `lib/loa/filter-categories.ts`:
```ts
import type { CatalogCategory } from '@/features/loa/types'

/**
 * Filter kategori untuk tampilan search per-sesi. Kembalikan hanya kategori
 * yang punya >=1 item cocok (nama item mengandung query, case-insensitive),
 * dengan items dipersempit ke yang cocok. Query kosong/whitespace → utuh.
 * Tidak memutasi input.
 */
export function filterCategoriesByQuery(
  categories: CatalogCategory[],
  query: string
): CatalogCategory[] {
  const q = query.trim().toLowerCase()
  if (q === '') return categories
  const out: CatalogCategory[] = []
  for (const cat of categories) {
    const items = cat.items.filter((it) => it.nama.toLowerCase().includes(q))
    if (items.length > 0) out.push({ ...cat, items })
  }
  return out
}
```

- [ ] **Step 4: Jalankan — pastikan lulus** — `npx vitest run lib/loa/filter-categories.test.ts`. Expected: PASS (5 tests).

- [ ] **Step 5: Commit**
```bash
git add lib/loa/filter-categories.ts lib/loa/filter-categories.test.ts
git commit -m "feat(loa): helper filterCategoriesByQuery untuk search menu (tested)"
```

---

## Task 2: Komponen `PackageCombobox` (picker paket ber-search)

**Files:**
- Create: `features/loa/components/package-combobox.tsx`

- [ ] **Step 1: Implementasi komponen**

Create `features/loa/components/package-combobox.tsx`:
```tsx
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
}

/**
 * Picker paket ber-search (Popover + Command, mode popper via portal) →
 * tidak terpotong di dalam Sheet. Menggantikan Select shadcn.
 */
export function PackageCombobox({ packagesByKategori, value, onChange }: PackageComboboxProps) {
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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`. Expected: tidak ada error baru dari file ini (drawer masih pakai Select sampai Task 3 — itu belum diubah, jadi tetap kompilasi).

- [ ] **Step 3: Commit**
```bash
git add features/loa/components/package-combobox.tsx
git commit -m "feat(loa): PackageCombobox — picker paket ber-search (Popover+Command)"
```

---

## Task 3: `menu-selection-group.tsx` — search per-sesi + warna + chip

**Files:**
- Modify: `features/loa/components/menu-selection-group.tsx` (ganti seluruh isi)

- [ ] **Step 1: Ganti seluruh isi file**

Replace `features/loa/components/menu-selection-group.tsx`:
```tsx
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
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`. Expected: error baru di `menu-drawer.tsx` (belum mengirim prop `accentIndex`) — diperbaiki di Task 4. Tidak apa-apa sementara.

- [ ] **Step 3: Commit**
```bash
git add features/loa/components/menu-selection-group.tsx
git commit -m "feat(loa): menu selection — search per-sesi, kartu berwarna, chip item"
```

---

## Task 4: `menu-drawer.tsx` — pakai PackageCombobox, input full width, warna, accentIndex

**Files:**
- Modify: `features/loa/components/menu-drawer.tsx`

- [ ] **Step 1: Ganti import Select → PackageCombobox**

Hapus blok import `Select` dan tambah import `PackageCombobox`. Ganti:
```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
```
menjadi:
```tsx
import { PackageCombobox } from './package-combobox'
```

- [ ] **Step 2: Ganti blok picker Paket**

Ganti blok JSX:
```tsx
          {/* Paket */}
          <div className="space-y-1.5">
            <Label>Paket</Label>
            <Select value={packageId} onValueChange={handlePackageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih paket..." />
              </SelectTrigger>
              <SelectContent>
                {packagesByKategori.map(([kategori, pkgs]) => (
                  <SelectGroup key={kategori}>
                    <SelectLabel>{kategori}</SelectLabel>
                    {pkgs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.namaPaket}
                        {p.hasSelection && (
                          <span className="ml-1 text-[11px] text-green-600">●</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
```
menjadi:
```tsx
          {/* Paket */}
          <div className="space-y-1.5">
            <Label>Paket</Label>
            <PackageCombobox
              packagesByKategori={packagesByKategori}
              value={packageId}
              onChange={handlePackageChange}
            />
          </div>
```

- [ ] **Step 3: Input Pax & Harga full width (stack)**

Ganti blok:
```tsx
          {pkg && (
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="pax">Pax</Label>
                <Input
                  id="pax"
                  type="number"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="price">Harga / pax</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={pricePerPax}
                  onChange={(e) => setPricePerPax(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}
```
menjadi:
```tsx
          {pkg && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="pax">Pax</Label>
                <Input
                  id="pax"
                  type="number"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Harga / pax</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={pricePerPax}
                  onChange={(e) => setPricePerPax(e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </>
          )}
```

- [ ] **Step 4: Kirim `accentIndex` ke MenuSelectionGroup**

Ganti `{occasions.map((occ) => {` menjadi `{occasions.map((occ, occIdx) => {` lalu pada `<MenuSelectionGroup ... />` tambahkan prop `accentIndex={occIdx}`. Hasil akhir blok:
```tsx
          {occasions.map((occ, occIdx) => {
            const errorIds = new Set(
              errors
                .filter((e) => e.categoryId.startsWith(`${occ.key}#`))
                .map((e) => e.categoryId.slice(occ.key.length + 1))
            )
            return (
              <MenuSelectionGroup
                key={occ.key}
                componentName={occ.componentName}
                occasionNo={occ.occasionNo}
                showOccasion={occ.showOccasion}
                categories={occ.categories}
                value={selections[occ.key] ?? {}}
                onChange={(catId, ids) => setItemIds(occ.key, catId, ids)}
                errorIds={errorIds}
                accentIndex={occIdx}
              />
            )
          })}
```

- [ ] **Step 5: Warna header, footer & tombol Simpan**

Ganti `<SheetHeader className="border-b px-5 py-4">` menjadi:
```tsx
        <SheetHeader className="bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-4">
```
dan di dalamnya ganti `<SheetTitle>Tambah Item LoA</SheetTitle>` menjadi:
```tsx
          <SheetTitle className="text-white">🍽️ Tambah Item LoA</SheetTitle>
```

Ganti `<SheetFooter className="border-t px-5 py-4">` menjadi:
```tsx
        <SheetFooter className="border-t bg-slate-50 px-5 py-4">
```

Ganti tombol Simpan (`<Button disabled={!canSave} onClick={...}>Simpan Item</Button>`) — tambahkan className gradient. Ganti baris `<Button` pembuka tombol simpan menjadi:
```tsx
            <Button
              className="bg-gradient-to-r from-indigo-500 to-violet-500 font-semibold hover:from-indigo-600 hover:to-violet-600"
              disabled={!canSave}
```
(biarkan sisa atribut `onClick` & isi tombol "Simpan Item" apa adanya).

- [ ] **Step 6: Typecheck + vitest** — `npx tsc --noEmit && npx vitest run`. Expected: bersih, semua test hijau.

- [ ] **Step 7: Commit**
```bash
git add features/loa/components/menu-drawer.tsx
git commit -m "feat(loa): drawer Tambah Item — PackageCombobox, input full width, warna"
```

---

## Verifikasi Akhir

- [ ] `npx vitest run` → semua hijau (termasuk `filter-categories`).
- [ ] `npx tsc --noEmit` → bersih.
- [ ] `npm run build` → sukses.
- [ ] **Manual (browser, `/orders/[id]/loa` → "+ Tambah Item"):**
  - Dropdown paket **tidak terpotong**, bisa di-search, pilih paket → **menu muncul**.
  - Search menu per-sesi memfilter item; hapus query → pilihan tetap utuh.
  - Input Pax & Harga/pax **full width** (bertumpuk).
  - Header & tombol gradient indigo–violet; tiap kartu sesi beraksen warna berbeda; badge "pilih 1"/"pilih bebas" & chip item berwarna.
  - Simpan Item → masuk ke daftar step Items; angka & menu_detail benar.

---

## Peta Spec → Task

| Spec | Task |
|------|------|
| §3 Helper filter (TDD) | 1 |
| §2.1 PackageCombobox (fix dropdown + search paket) | 2, 4 |
| §2.3 Search menu per-sesi + warna + chip | 3 |
| §2.2 Input full width + warna header/footer + integrasi | 4 |
| §6 Verifikasi | Verifikasi Akhir |
