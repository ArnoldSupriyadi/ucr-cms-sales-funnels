'use client'

import { useMemo, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MenuSelectionGroup } from './menu-selection-group'
import {
  validateCategorySelections,
  type CategorySelectionState,
} from '@/lib/loa/selection-rules'
import { generateMenuDetail } from '@/lib/loa/menu-detail'
import { formatRupiah } from '@/lib/utils/format'
import type { CatalogCategory, MenuCatalog, LoaItemDraft, DraftSelection } from '../types'

interface MenuDrawerProps {
  catalog: MenuCatalog
  onAddItem: (item: LoaItemDraft) => void
  trigger?: React.ReactNode
}

interface Occasion {
  key: string // `${componentType}#${occasionNo}`
  componentName: string
  occasionNo: number
  showOccasion: boolean
  categories: CatalogCategory[]
}

export function MenuDrawer({ catalog, onAddItem, trigger }: MenuDrawerProps) {
  const [open, setOpen] = useState(false)
  const [packageId, setPackageId] = useState('')
  const [pax, setPax] = useState('')
  const [pricePerPax, setPricePerPax] = useState('')
  // selections[occasionKey][categoryId] = item ids
  const [selections, setSelections] = useState<Record<string, Record<string, string[]>>>({})

  const pkg = catalog.packages.find((p) => p.id === packageId)

  const packagesByKategori = useMemo(() => {
    const m = new Map<string, typeof catalog.packages>()
    for (const p of catalog.packages) {
      const arr = m.get(p.kategori) ?? []
      arr.push(p)
      m.set(p.kategori, arr)
    }
    return [...m.entries()]
  }, [catalog])

  function handlePackageChange(id: string) {
    const p = catalog.packages.find((x) => x.id === id)
    setPackageId(id)
    setPricePerPax(String(p?.hargaPerPax ?? p?.hargaMinimum ?? ''))
    setSelections({})
  }

  const occasions: Occasion[] = useMemo(() => {
    if (!pkg || !pkg.hasSelection) return []
    const list: Occasion[] = []
    for (const comp of pkg.components) {
      const cats = catalog.categoriesByComponentType[comp.componentType] ?? []
      if (cats.length === 0) continue
      for (let o = 1; o <= comp.qty; o++) {
        list.push({
          key: `${comp.componentType}#${o}`,
          componentName: comp.nama,
          occasionNo: o,
          showOccasion: comp.qty > 1,
          categories: cats,
        })
      }
    }
    return list
  }, [pkg, catalog])

  function setItemIds(occasionKey: string, categoryId: string, itemIds: string[]) {
    setSelections((prev) => ({
      ...prev,
      [occasionKey]: { ...(prev[occasionKey] ?? {}), [categoryId]: itemIds },
    }))
  }

  const validationStates: CategorySelectionState[] = useMemo(() => {
    const states: CategorySelectionState[] = []
    for (const occ of occasions) {
      const slice = selections[occ.key] ?? {}
      for (const cat of occ.categories) {
        states.push({
          categoryId: `${occ.key}#${cat.id}`,
          categoryName: cat.nama,
          rule: cat.rule,
          selectedItemIds: slice[cat.id] ?? [],
        })
      }
    }
    return states
  }, [occasions, selections])

  const errors = validateCategorySelections(validationStates)
  const erroredCompositeKeys = new Set(errors.map((e) => e.categoryId))

  const previewText = useMemo(() => {
    const sels = []
    for (const occ of occasions) {
      const slice = selections[occ.key] ?? {}
      for (const cat of occ.categories) {
        for (const itemId of slice[cat.id] ?? []) {
          const item = cat.items.find((i) => i.id === itemId)
          if (item) {
            sels.push({
              componentName: occ.componentName,
              occasionNo: occ.occasionNo,
              categoryName: cat.nama,
              itemName: item.nama,
            })
          }
        }
      }
    }
    return generateMenuDetail(sels)
  }, [occasions, selections])

  const paxNum = Number(pax)
  const priceNum = Number(pricePerPax)
  const amount = paxNum > 0 && priceNum > 0 ? paxNum * priceNum : 0
  const selectionOk = !pkg?.hasSelection || errors.length === 0
  const canSave = !!pkg && paxNum > 0 && priceNum > 0 && selectionOk

  function reset() {
    setPackageId('')
    setPax('')
    setPricePerPax('')
    setSelections({})
  }

  function buildSelections(): DraftSelection[] {
    const out: DraftSelection[] = []
    for (const occ of occasions) {
      const slice = selections[occ.key] ?? {}
      for (const cat of occ.categories) {
        for (const itemId of slice[cat.id] ?? []) {
          const item = cat.items.find((i) => i.id === itemId)
          if (item) {
            out.push({
              componentName: occ.componentName,
              occasionNo: occ.occasionNo,
              categoryId: cat.id,
              categoryName: cat.nama,
              itemId: item.id,
              itemName: item.nama,
            })
          }
        }
      }
    }
    return out
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <SheetTrigger asChild>{trigger ?? <Button>+ Tambah Item</Button>}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Tambah Item LoA</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
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

          {pkg && !pkg.hasSelection && (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-[13px] text-slate-500">
              Paket ini tanpa pilihan menu terstruktur.
            </p>
          )}

          {occasions.map((occ) => {
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
              />
            )
          })}
        </div>

        <SheetFooter className="border-t px-5 py-4">
          {pkg?.hasSelection && (
            <div className="mb-1 w-full">
              <div className="text-[11px] font-medium text-slate-500">Preview menu_detail (auto)</div>
              <div className="mt-0.5 line-clamp-2 text-[12px] text-slate-600">
                {previewText || <span className="text-slate-400">— belum ada pilihan —</span>}
              </div>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-slate-500">
              {amount > 0 ? formatRupiah(amount) : '—'}
            </span>
            <Button
              disabled={!canSave}
              onClick={() => {
                if (!pkg) return
                onAddItem({
                  key: crypto.randomUUID(),
                  packageId: pkg.id,
                  packageName: pkg.namaPaket,
                  pricePerPax: priceNum,
                  pax: paxNum,
                  selections: buildSelections(),
                })
                setOpen(false)
                reset()
              }}
            >
              Simpan Item
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
