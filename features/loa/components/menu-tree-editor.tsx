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
import { PackageCombobox } from './package-combobox'
import { packageToHeader } from '@/lib/loa/catalog-suggest'
import type { EventDraft, MenuCatalog, HeaderDraft, SectionDraft, SubGroupDraft, CatalogPackage } from '../types'

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
          className="w-full border-dashed text-indigo-600"
          onClick={() => dispatch({ type: 'ADD_HEADER', eventKey: event.key })}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Header
        </Button>
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 px-2 py-1.5">
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
  const price = header.pax > 0 ? header.amount / header.pax : 0

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 px-4 py-3.5">
      <div className="flex items-start gap-2">
        <Input
          value={header.name}
          placeholder="Nama header (mis. Full Day Meeting Package)"
          className="font-semibold"
          onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'name', value: e.target.value })}
        />
        <button type="button" className="mt-2 shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_HEADER', eventKey, headerKey: hk })}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <Input
        value={header.keterangan}
        placeholder="Keterangan header (opsional)"
        className="text-sm"
        onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'keterangan', value: e.target.value })}
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-500">Pax</Label>
          <Input type="number" min={0} value={header.pax || ''}
            onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'pax', value: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-500">Amount (Rp)</Label>
          <Input type="number" min={0} value={header.amount || ''}
            onChange={(e) => dispatch({ type: 'SET_HEADER_FIELD', eventKey, headerKey: hk, field: 'amount', value: Number(e.target.value) })} />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-slate-500">Price/pax (auto)</Label>
          <Input value={price > 0 ? formatRupiah(price) : '—'} readOnly className="bg-slate-50 text-slate-500" />
        </div>
      </div>

      {/* Item langsung di header */}
      {header.items.map((it) => (
        <ItemRow key={it.key} eventKey={eventKey} headerKey={hk} sectionKey={null} subGroupKey={null}
          itemKey={it.key} name={it.name} keterangan={it.keterangan} catalog={catalog} />
      ))}
      <button type="button" className="text-[13px] text-indigo-600 hover:underline"
        onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey: hk, sectionKey: null, subGroupKey: null })}>
        + item
      </button>

      {/* Komponen (Section) */}
      {header.sections.map((s) => (
        <SectionCard key={s.key} eventKey={eventKey} headerKey={hk} section={s} catalog={catalog} />
      ))}
      <div>
        <button type="button" className="text-[13px] font-medium text-slate-600 hover:text-indigo-600"
          onClick={() => dispatch({ type: 'ADD_SECTION', eventKey, headerKey: hk })}>
          + Komponen (mis. Coffee Break / Buffet)
        </button>
      </div>
    </div>
  )
}

function SectionCard({ eventKey, headerKey, section, catalog }: { eventKey: string; headerKey: string; section: SectionDraft; catalog: MenuCatalog }) {
  const { dispatch } = useLoaForm()
  const sk = section.key
  return (
    <div className="ml-2 space-y-2 rounded-md border-l-2 border-indigo-100 bg-slate-50/40 py-2 pl-3 pr-2">
      <div className="flex items-center gap-2">
        <Input value={section.name} placeholder="Nama komponen (mis. Coffee Break 1)" className="text-sm font-semibold"
          onChange={(e) => dispatch({ type: 'SET_SECTION_FIELD', eventKey, headerKey, sectionKey: sk, field: 'name', value: e.target.value })} />
        <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_SECTION', eventKey, headerKey, sectionKey: sk })}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* item langsung di section */}
      {section.items.map((it) => (
        <ItemRow key={it.key} eventKey={eventKey} headerKey={headerKey} sectionKey={sk} subGroupKey={null}
          itemKey={it.key} name={it.name} keterangan={it.keterangan} catalog={catalog} />
      ))}

      {/* sub-kategori */}
      {section.subGroups.map((sg) => (
        <SubGroupCard key={sg.key} eventKey={eventKey} headerKey={headerKey} sectionKey={sk} subGroup={sg} catalog={catalog} />
      ))}

      <div className="flex gap-3">
        <button type="button" className="text-[13px] text-indigo-600 hover:underline"
          onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey, sectionKey: sk, subGroupKey: null })}>
          + item
        </button>
        <button type="button" className="text-[13px] text-indigo-600 hover:underline"
          onClick={() => dispatch({ type: 'ADD_SUBGROUP', eventKey, headerKey, sectionKey: sk })}>
          + Sub-kategori
        </button>
      </div>
    </div>
  )
}

function SubGroupCard({ eventKey, headerKey, sectionKey, subGroup, catalog }: {
  eventKey: string; headerKey: string; sectionKey: string; subGroup: SubGroupDraft; catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  const gk = subGroup.key
  return (
    <div className="ml-2 space-y-2 border-l border-slate-200 pl-3">
      <div className="flex items-center gap-2">
        <CategoryCombobox
          value={subGroup.name}
          catalog={catalog}
          onChange={(v) => dispatch({ type: 'SET_SUBGROUP_FIELD', eventKey, headerKey, sectionKey, subGroupKey: gk, field: 'name', value: v })}
        />
        <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_SUBGROUP', eventKey, headerKey, sectionKey, subGroupKey: gk })}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {subGroup.items.map((it) => (
        <ItemRow key={it.key} eventKey={eventKey} headerKey={headerKey} sectionKey={sectionKey} subGroupKey={gk}
          itemKey={it.key} name={it.name} keterangan={it.keterangan} catalog={catalog} />
      ))}
      <button type="button" className="text-[13px] text-indigo-600 hover:underline"
        onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey, sectionKey, subGroupKey: gk })}>
        + item
      </button>
    </div>
  )
}

function ItemRow({ eventKey, headerKey, sectionKey, subGroupKey, itemKey, name, keterangan, catalog }: {
  eventKey: string; headerKey: string; sectionKey: string | null; subGroupKey: string | null
  itemKey: string; name: string; keterangan: string; catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <ItemCombobox value={name} catalog={catalog}
          onChange={(v) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, sectionKey, subGroupKey, itemKey, field: 'name', value: v })} />
      </div>
      <Input value={keterangan} placeholder="keterangan (mis. tidak pedas)" className="w-40 text-sm"
        onChange={(e) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, sectionKey, subGroupKey, itemKey, field: 'keterangan', value: e.target.value })} />
      <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', eventKey, headerKey, sectionKey, subGroupKey, itemKey })}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
