'use client'

import { useMemo } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatRupiah } from '@/lib/utils/format'
import { useLoaForm } from '../loa-form-context'
import { ItemCombobox } from './item-combobox'
import { CategoryCombobox } from './category-combobox'
import { HeaderCombobox } from './header-combobox'
import { PackageCombobox } from './package-combobox'
import { packageToHeader } from '@/lib/loa/catalog-suggest'
import type { EventDraft, MenuCatalog, HeaderDraft, SubGroupDraft, CatalogPackage } from '../types'

const chip = 'rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide'
const addBtn = 'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] font-medium transition-colors'

export function MenuTreeEditor({ event, catalog }: { event: EventDraft; catalog: MenuCatalog }) {
  const { dispatch } = useLoaForm()
  const packagesByKategori = useMemo<[string, CatalogPackage[]][]>(() => {
    const m = new Map<string, CatalogPackage[]>()
    for (const p of catalog.packages) {
      const arr = m.get(p.kategori) ?? []
      arr.push(p)
      m.set(p.kategori, arr)
    }
    return [...m.entries()]
  }, [catalog])

  return (
    <div className="space-y-3">
      {event.headers.map((h) => (
        <HeaderCard key={h.key} eventKey={event.key} header={h} catalog={catalog} />
      ))}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
          onClick={() => dispatch({ type: 'ADD_HEADER', eventKey: event.key })}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Header
        </Button>
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-2 py-1.5">
          <div className="mb-1 text-[11px] font-semibold text-amber-700">+ Tambah dari Paket</div>
          <PackageCombobox
            packagesByKategori={packagesByKategori}
            value=""
            onChange={(id) => {
              const h = packageToHeader(catalog, id)
              if (h) dispatch({ type: 'ADD_PREFILLED_HEADER', eventKey: event.key, header: h })
            }}
          />
        </div>
      </div>
    </div>
  )
}

function HeaderCard({ eventKey, header, catalog }: { eventKey: string; header: HeaderDraft; catalog: MenuCatalog }) {
  const { dispatch } = useLoaForm()
  const hk = header.key
  const lineTotal = (header.amount || 0) * (header.pax || 0) // amount = harga/pax

  return (
    <div className="space-y-3 rounded-xl border border-indigo-200 border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-white px-4 py-3.5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`${chip} shrink-0 bg-indigo-100 text-indigo-700`}>Header</span>
        <div className="flex-1">
          <HeaderCombobox
            value={header.name}
            catalog={catalog}
            onChange={(v) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'name', value: v })}
          />
        </div>
        <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_HEADER', eventKey, headerKey: hk })}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Input
        value={header.keterangan}
        placeholder="Keterangan header (opsional)"
        className="bg-white text-sm"
        onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'keterangan', value: e.target.value })}
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-indigo-600">Pax</Label>
          <Input type="number" min={0} value={header.pax || ''} className="bg-white"
            onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'pax', value: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-indigo-600">Harga/pax (Rp)</Label>
          <Input type="number" min={0} value={header.amount || ''} className="bg-white"
            onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'amount', value: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-indigo-600">Total (auto)</Label>
          <Input value={lineTotal > 0 ? formatRupiah(lineTotal) : '—'} readOnly className="bg-indigo-50/60 font-semibold text-indigo-700" />
        </div>
      </div>

      {/* Jenis Menu langsung di bawah Header */}
      {header.subGroups.map((sg) => (
        <SubGroupCard key={sg.key} eventKey={eventKey} headerKey={hk} subGroup={sg} catalog={catalog} />
      ))}
      <div>
        <button type="button" className={`${addBtn} bg-violet-50 text-violet-700 hover:bg-violet-100`}
          onClick={() => dispatch({ type: 'ADD_SUBGROUP', eventKey, headerKey: hk })}>
          <Plus className="h-3.5 w-3.5" /> Jenis Menu
        </button>
      </div>
    </div>
  )
}

function SubGroupCard({ eventKey, headerKey, subGroup, catalog }: {
  eventKey: string; headerKey: string; subGroup: SubGroupDraft; catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  const gk = subGroup.key
  return (
    <div className="ml-2 space-y-2 rounded-md border-l-4 border-l-violet-400 bg-violet-50/40 py-1.5 pl-3 pr-2">
      <div className="flex items-center gap-2">
        <span className={`${chip} shrink-0 bg-violet-100 text-violet-700`}>Jenis Menu</span>
        <CategoryCombobox
          value={subGroup.name}
          catalog={catalog}
          onChange={(v) => dispatch({ type: 'SET_SUBGROUP_FIELD', eventKey, headerKey, subGroupKey: gk, field: 'name', value: v })}
        />
        <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_SUBGROUP', eventKey, headerKey, subGroupKey: gk })}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {subGroup.items.map((it) => (
        <ItemRow key={it.key} eventKey={eventKey} headerKey={headerKey} subGroupKey={gk}
          itemKey={it.key} name={it.name} keterangan={it.keterangan} catalog={catalog} categoryName={subGroup.name} />
      ))}
      <button type="button" className={`${addBtn} text-indigo-600 hover:bg-indigo-50`}
        onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey, subGroupKey: gk })}>
        <Plus className="h-3.5 w-3.5" /> item
      </button>
    </div>
  )
}

function ItemRow({ eventKey, headerKey, subGroupKey, itemKey, name, keterangan, catalog, categoryName }: {
  eventKey: string; headerKey: string; subGroupKey: string
  itemKey: string; name: string; keterangan: string; catalog: MenuCatalog; categoryName?: string
}) {
  const { dispatch } = useLoaForm()
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <ItemCombobox value={name} catalog={catalog} categoryName={categoryName}
          onChange={(v) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, subGroupKey, itemKey, field: 'name', value: v })} />
      </div>
      <Input value={keterangan} placeholder="keterangan (mis. tidak pedas)" className="w-40 bg-white text-sm"
        onChange={(e) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, subGroupKey, itemKey, field: 'keterangan', value: e.target.value })} />
      <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', eventKey, headerKey, subGroupKey, itemKey })}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
