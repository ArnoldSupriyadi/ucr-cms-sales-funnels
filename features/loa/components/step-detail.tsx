'use client'

import Image from 'next/image'
import { Trash2, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useLoaForm } from '../loa-form-context'
import { UMARA_COMPANY } from '../company'
import { hariID } from '@/lib/utils/date-id'
import { formatDateRange } from '@/lib/utils/format'

export function StepDetail() {
  const { state, dispatch, meta, salesUsers } = useLoaForm()
  const { detail, events } = state
  const { client } = meta
  const sales = salesUsers.find((u) => u.id === detail.salesId)

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        {/* Kop surat */}
        <div className="flex items-center gap-4 border-b-[3px] border-double border-slate-800 pb-3.5">
          <Image src={UMARA_COMPANY.logo} alt={UMARA_COMPANY.brandName} width={140} height={116}
            className="h-[116px] w-auto object-contain" />
          <div className="ml-auto text-right text-[12.5px] leading-relaxed text-slate-500">
            <span className="text-sm font-bold text-slate-900">{UMARA_COMPANY.brandName}</span><br />
            {UMARA_COMPANY.address}<br />
            {UMARA_COMPANY.phone} · {UMARA_COMPANY.email}
          </div>
        </div>

        {/* Data Klien (readonly) */}
        <GroupLabel>Data Klien <Src>dari leads</Src></GroupLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReadField label="Nama" value={client.name} />
          <ReadField label="Segmen" value={client.segmen} />
        </div>
        <ReadField label="Alamat (kantor)" value={client.address} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReadField label="PIC" value={client.picName} />
          <ReadField label="HP" value={client.picPhone} />
        </div>

        {/* Nama Kegiatan (LOA-level) */}
        <GroupLabel>Kegiatan <Src>input sales</Src></GroupLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EditField label="Nama Kegiatan" value={detail.eventName}
            onChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'eventName', value: v })} />
          <ReadField label="Tanggal Kegiatan" value={meta.eventDateStart ? formatDateRange(meta.eventDateStart, meta.eventDateEnd) : '—'} />
        </div>

        {/* Event (multi-tanggal) */}
        <div className="flex items-center justify-between pt-1">
          <GroupLabel>Waktu &amp; Tempat <Src>per event</Src></GroupLabel>
          <Button type="button" size="sm" className="gap-1.5 bg-amber-400 font-semibold text-amber-950 shadow-sm hover:bg-amber-500"
            onClick={() => dispatch({ type: 'ADD_EVENT' })}>
            <Plus className="h-4 w-4" /> Tambah Event
          </Button>
        </div>

        {events.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada event. Klik &ldquo;Tambah Event&rdquo;.</p>
        )}

        {events.map((ev, idx) => (
          <div key={ev.key} className="space-y-3 rounded-lg border border-sky-200 border-l-4 border-l-sky-400 bg-sky-50/40 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sky-700">Event {idx + 1}</span>
              <button type="button"
                className="inline-flex items-center gap-1 text-[13px] text-slate-400 hover:text-red-600"
                onClick={() => dispatch({ type: 'REMOVE_EVENT', eventKey: ev.key })}>
                <Trash2 className="h-3.5 w-3.5" /> hapus
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Tanggal</Label>
                <Input type="date" value={ev.eventDate}
                  onChange={(e) => dispatch({ type: 'SET_EVENT_FIELD', eventKey: ev.key, field: 'eventDate', value: e.target.value })} />
              </div>
              <ReadField label="Hari (auto)" value={ev.eventDate ? hariID(ev.eventDate) : '—'} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EditField label="Waktu siap saji" value={ev.servingTime} placeholder="08:00 - 17:00"
                onChange={(v) => dispatch({ type: 'SET_EVENT_FIELD', eventKey: ev.key, field: 'servingTime', value: v })} />
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Pax</Label>
                <Input type="number" min={0} value={ev.pax || ''}
                  onChange={(e) => dispatch({ type: 'SET_EVENT_FIELD', eventKey: ev.key, field: 'pax', value: Number(e.target.value) })} />
              </div>
            </div>
            <EditField label="Tempat" value={ev.venue} placeholder="Nama gedung / ruang"
              onChange={(v) => dispatch({ type: 'SET_EVENT_FIELD', eventKey: ev.key, field: 'venue', value: v })} />
            <EditField label="Set Up" value={ev.setupLocation} placeholder="mis. mulai setup 06:00"
              onChange={(v) => dispatch({ type: 'SET_EVENT_FIELD', eventKey: ev.key, field: 'setupLocation', value: v })} />
          </div>
        ))}

        {/* Pihak Umara */}
        <GroupLabel>Pihak Umara Catering</GroupLabel>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Sales in charge</Label>
          <Select value={detail.salesId}
            onValueChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'salesId', value: v })}>
            <SelectTrigger><SelectValue placeholder="Pilih sales..." /></SelectTrigger>
            <SelectContent>
              {salesUsers.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReadField label="HP Sales" value={sales?.phone ?? '—'} />
          <ReadField label="Email Sales" value={sales?.email ?? '—'} />
        </div>
      </CardContent>
    </Card>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-bold uppercase tracking-wide text-indigo-600">{children}</div>
}
function Src({ children }: { children: React.ReactNode }) {
  return <span className="ml-1.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">{children}</span>
}
function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      <Input value={value} readOnly className="bg-slate-50 text-slate-500" />
    </div>
  )
}
function EditField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
