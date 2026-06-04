'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useLoaForm } from '../loa-form-context'
import { UMARA_COMPANY } from '../company'
import { hariID, tanggalID } from '@/lib/utils/date-id'

export function StepDetail() {
  const { state, dispatch, meta, salesUsers } = useLoaForm()
  const { detail } = state
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

        {/* Header dokumen */}
        <div className="rounded-lg border bg-slate-50/50 px-4 py-3.5 text-[13px]">
          <div className="flex justify-between text-slate-500">
            <span>No. Dokumen: <b className="text-slate-900">{UMARA_COMPANY.docNo}</b></span>
            <span>Revisi: <b className="text-slate-900">00</b></span>
          </div>
          <div className="my-3 text-center text-[15px] font-bold leading-relaxed">
            SURAT PERJANJIAN PENYEDIAAN JASA KATERING<br />
            antara {UMARA_COMPANY.legalName} dan <u className="decoration-indigo-600">{client.name}</u>
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

        {/* Detail Kegiatan (editable) */}
        <GroupLabel>Detail Kegiatan <Src>input sales</Src></GroupLabel>
        <EditField label="Nama Kegiatan" value={detail.eventName}
          onChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'eventName', value: v })} />
        <EditField label="Alamat Kegiatan" value={detail.eventAddress}
          onChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'eventAddress', value: v })} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Tanggal Kegiatan</Label>
            <Input type="date" value={detail.eventDate}
              onChange={(e) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'eventDate', value: e.target.value })} />
          </div>
          <ReadField label="Hari (auto)" value={hariID(detail.eventDate)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EditField label="Waktu" value={detail.eventTime}
            onChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'eventTime', value: v })} />
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Pax</Label>
            <Input type="number" min={1} value={detail.pax || ''}
              onChange={(e) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'pax', value: Number(e.target.value) })} />
          </div>
        </div>
        <EditField label="Set Up" value={detail.setupLocation} placeholder="mis. mulai setup 06:00 / standing party"
          onChange={(v) => dispatch({ type: 'SET_DETAIL_FIELD', field: 'setupLocation', value: v })} />

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

        {/* Section I */}
        <div className="pt-2 text-sm font-bold">I. WAKTU &amp; TEMPAT KEGIATAN</div>
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-slate-100">
              {['Tgl.', 'Hari', 'Waktu siap saji', 'Tempat', 'Set Up', 'Pax'].map((h) => (
                <th key={h} className="border border-slate-400 px-2.5 py-2 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 px-2.5 py-2 text-center">{tanggalID(detail.eventDate)}</td>
              <td className="border border-slate-400 px-2.5 py-2 text-center">{hariID(detail.eventDate)}</td>
              <td className="border border-slate-400 px-2.5 py-2 text-center">{detail.eventTime || '—'}</td>
              <td className="border border-slate-400 px-2.5 py-2 text-left">{detail.eventAddress || '—'}</td>
              <td className="border border-slate-400 px-2.5 py-2 text-center">{detail.setupLocation || ''}</td>
              <td className="border border-slate-400 px-2.5 py-2 text-center">{detail.pax || '—'}</td>
            </tr>
          </tbody>
        </table>
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
