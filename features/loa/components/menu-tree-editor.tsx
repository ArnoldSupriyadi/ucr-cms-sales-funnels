'use client'

import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatRupiah } from '@/lib/utils/format'
import { useLoaForm } from '../loa-form-context'
import { ItemCombobox } from './item-combobox'
import type { EventDraft, MenuCatalog, HeaderDraft, SubGroupDraft } from '../types'

export function MenuTreeEditor({ event, catalog }: { event: EventDraft; catalog: MenuCatalog }) {
  const { dispatch } = useLoaForm()

  return (
    <div className="space-y-3">
      {event.headers.map((h) => (
        <HeaderCard key={h.key} eventKey={event.key} header={h} catalog={catalog} />
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed text-indigo-600"
        onClick={() => dispatch({ type: 'ADD_HEADER', eventKey: event.key })}
      >
        <Plus className="mr-1.5 h-4 w-4" /> Tambah Header
      </Button>
    </div>
  )
}

function HeaderCard({
  eventKey, header, catalog,
}: {
  eventKey: string
  header: HeaderDraft
  catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  const hk = header.key
  const price = header.pax > 0 ? header.amount / header.pax : 0

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 px-4 py-3.5">
      <div className="flex items-start gap-2">
        <Input
          value={header.name}
          placeholder="Nama header (mis. Coffee Break 1, Indonesian Buffet)"
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
      <div className="space-y-2">
        {header.items.map((it) => (
          <ItemRow key={it.key} eventKey={eventKey} headerKey={hk} subGroupKey={null} itemKey={it.key}
            name={it.name} keterangan={it.keterangan} catalog={catalog} />
        ))}
        <button type="button" className="text-[13px] text-indigo-600 hover:underline"
          onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey: hk, subGroupKey: null })}>
          + item
        </button>
      </div>

      {/* Sub-grup */}
      {header.subGroups.map((sg) => (
        <SubGroupCard key={sg.key} eventKey={eventKey} headerKey={hk} subGroup={sg} catalog={catalog} />
      ))}
      <button type="button" className="text-[13px] text-slate-500 hover:text-indigo-600"
        onClick={() => dispatch({ type: 'ADD_SUBGROUP', eventKey, headerKey: hk })}>
        + sub-grup (mis. Soup / Main Course)
      </button>
    </div>
  )
}

function SubGroupCard({
  eventKey, headerKey, subGroup, catalog,
}: {
  eventKey: string
  headerKey: string
  subGroup: SubGroupDraft
  catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  const sgk = subGroup.key
  return (
    <div className="ml-3 space-y-2 border-l-2 border-slate-100 pl-3">
      <div className="flex items-center gap-2">
        <Input value={subGroup.name} placeholder="Nama sub-grup" className="text-sm font-medium"
          onChange={(e) => dispatch({ type: 'SET_SUBGROUP_FIELD', eventKey, headerKey, subGroupKey: sgk, field: 'name', value: e.target.value })} />
        <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
          onClick={() => dispatch({ type: 'REMOVE_SUBGROUP', eventKey, headerKey, subGroupKey: sgk })}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {subGroup.items.map((it) => (
        <ItemRow key={it.key} eventKey={eventKey} headerKey={headerKey} subGroupKey={sgk} itemKey={it.key}
          name={it.name} keterangan={it.keterangan} catalog={catalog} />
      ))}
      <button type="button" className="text-[13px] text-indigo-600 hover:underline"
        onClick={() => dispatch({ type: 'ADD_ITEM', eventKey, headerKey, subGroupKey: sgk })}>
        + item
      </button>
    </div>
  )
}

function ItemRow({
  eventKey, headerKey, subGroupKey, itemKey, name, keterangan, catalog,
}: {
  eventKey: string
  headerKey: string
  subGroupKey: string | null
  itemKey: string
  name: string
  keterangan: string
  catalog: MenuCatalog
}) {
  const { dispatch } = useLoaForm()
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <ItemCombobox
          value={name}
          catalog={catalog}
          onChange={(v) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, subGroupKey, itemKey, field: 'name', value: v })}
        />
      </div>
      <Input
        value={keterangan}
        placeholder="keterangan (mis. tidak pedas)"
        className="w-44 text-sm"
        onChange={(e) => dispatch({ type: 'SET_ITEM_FIELD', eventKey, headerKey, subGroupKey, itemKey, field: 'keterangan', value: e.target.value })}
      />
      <button type="button" className="shrink-0 text-slate-400 hover:text-red-600"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', eventKey, headerKey, subGroupKey, itemKey })}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
