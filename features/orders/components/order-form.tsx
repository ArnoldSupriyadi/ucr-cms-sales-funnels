'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SEGMEN_OPTIONS } from '@/lib/constants/segmen'
import { createOrder, updateOrder } from '../actions'
import type { Order, Lead, SegmenEnum } from '@/types/domain'

interface OrderFormProps {
  order?: Order
  leads: Pick<Lead, 'id' | 'company_name'>[]
  defaultLeadId?: string
}

export function OrderForm({ order, leads, defaultLeadId }: OrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [leadId, setLeadId] = useState(order?.lead_id ?? defaultLeadId ?? '')
  const [eventName, setEventName] = useState(order?.event_name ?? '')
  const [eventDate, setEventDate] = useState(order?.event_date ?? '')
  const [eventTime, setEventTime] = useState(order?.event_time ?? '')
  const [eventType, setEventType] = useState(order?.event_type ?? '')
  const [venue, setVenue] = useState(order?.venue ?? '')
  const [pax, setPax] = useState(String(order?.pax ?? ''))
  const [segmen, setSegmen] = useState(order?.segmen ?? '')
  const [isException, setIsException] = useState(order?.is_exception ?? false)
  const [exceptionReason, setExceptionReason] = useState(order?.exception_reason ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!leadId || !eventDate || !pax) return
    setLoading(true)

    const payload = {
      lead_id: leadId,
      event_name: eventName || null,
      event_date: eventDate,
      event_time: eventTime || null,
      event_type: eventType || null,
      venue: venue || null,
      pax: parseInt(pax, 10),
      segmen: (segmen || null) as SegmenEnum | null,
      is_exception: isException,
      exception_reason: isException ? exceptionReason || null : null,
    }

    const result = order
      ? await updateOrder(order.id, payload)
      : await createOrder(payload)

    if (!result.success) {
      toast.error('Gagal menyimpan', { description: result.error })
      setLoading(false)
      return
    }

    toast.success(order ? 'Order diperbarui' : 'Order dibuat')
    if (!order && result.success) {
      const data = result.data as { id: string; order_no: string }
      router.push(`/orders/${data.id}?created=1`)
    } else {
      router.push(`/orders/${order?.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="space-y-2">
        <Label>Klien (Lead) *</Label>
        <Select value={leadId} onValueChange={setLeadId} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih klien..." />
          </SelectTrigger>
          <SelectContent>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_name">Nama Event</Label>
        <Input
          id="event_name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Training Annual, Annual Gathering, dll"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Tanggal Event *</Label>
          <Input
            id="event_date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_time">Waktu Kegiatan</Label>
          <Input
            id="event_time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            placeholder="08:00 - 17:00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pax">Jumlah Pax *</Label>
          <Input
            id="pax"
            type="number"
            min={1}
            value={pax}
            onChange={(e) => setPax(e.target.value)}
            placeholder="100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_type">Jenis Event</Label>
          <Input
            id="event_type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Seminar, Meeting, dll"
          />
        </div>
        <div className="space-y-2">
          <Label>Segmen</Label>
          <Select value={segmen} onValueChange={setSegmen}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih segmen" />
            </SelectTrigger>
            <SelectContent>
              {SEGMEN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue">Venue / Lokasi</Label>
        <Textarea
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          rows={2}
          placeholder="Nama gedung, alamat venue"
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={isException}
            onChange={(e) => setIsException(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="font-medium">Order Pengecualian</span>
          <span className="text-slate-500">(di luar SOP normal)</span>
        </label>
        {isException && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="exception_reason">Alasan Pengecualian *</Label>
            <Textarea
              id="exception_reason"
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              rows={2}
              placeholder="Jelaskan alasan pengecualian"
              required={isException}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading || !leadId || !eventDate || !pax}>
          {loading ? 'Menyimpan...' : order ? 'Simpan Perubahan' : 'Buat Order'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
