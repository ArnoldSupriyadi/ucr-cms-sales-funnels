'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { SEGMEN_COLORS } from '@/lib/constants/segmen'
import {
  ORDER_TYPE_KEYS,
  ORDER_TYPES,
  categoriesForType,
  serviceChargePctForType,
} from '@/lib/constants/order-type'
import { createOrder, updateOrder } from '../actions'
import type { Order, Lead, SegmenEnum } from '@/types/domain'

interface OrderFormProps {
  order?: Order
  leads: Pick<Lead, 'id' | 'company_name' | 'segmen'>[]
  defaultLeadId?: string
}

const FIELD_LABELS: Record<string, string> = {
  leadId: 'Klien',
  eventDate: 'Tanggal Event',
  pax: 'Jumlah Pax',
  orderType: 'Tipe Order',
  orderCategory: 'Kategori',
  exceptionReason: 'Alasan Pengecualian',
}

const errorInput = 'border-red-400 focus-visible:ring-red-400'

export function OrderForm({ order, leads, defaultLeadId }: OrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAlert, setShowAlert] = useState(false)

  const [leadId, setLeadId] = useState(order?.lead_id ?? defaultLeadId ?? '')
  const [eventName, setEventName] = useState(order?.event_name ?? '')
  const [eventDate, setEventDate] = useState(order?.event_date ?? '')
  const [eventTime, setEventTime] = useState(order?.event_time ?? '')
  const [orderType, setOrderType] = useState(order?.order_type ?? '')
  const [orderCategory, setOrderCategory] = useState(order?.order_category ?? '')
  const [venue, setVenue] = useState(order?.venue ?? '')
  const [pax, setPax] = useState(String(order?.pax ?? ''))
  const [isException, setIsException] = useState(order?.is_exception ?? false)
  const [exceptionReason, setExceptionReason] = useState(order?.exception_reason ?? '')

  const leadOptions: ComboboxOption[] = leads.map((l) => ({
    value: l.id,
    label: l.company_name,
  }))

  // Segmen mengikuti lead terpilih (read-only, otomatis dari tabel leads)
  const selectedLead = leads.find((l) => l.id === leadId)
  const segmen = selectedLead?.segmen ?? null

  const orderTypeOptions: ComboboxOption[] = ORDER_TYPE_KEYS.map((k) => ({
    value: k,
    label: ORDER_TYPES[k].label,
  }))
  const categoryOptions: ComboboxOption[] = categoriesForType(orderType).map((c) => ({
    value: c,
    label: c,
  }))

  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!leadId) e.leadId = 'Klien wajib dipilih'
    if (!eventDate) e.eventDate = 'Tanggal event wajib diisi'
    const paxNum = parseInt(pax, 10)
    if (!pax || Number.isNaN(paxNum) || paxNum < 1)
      e.pax = 'Jumlah pax wajib diisi (minimal 1)'
    if (!orderType) e.orderType = 'Tipe order wajib dipilih'
    else if (!orderCategory) e.orderCategory = 'Kategori wajib dipilih'
    if (isException && !exceptionReason.trim())
      e.exceptionReason = 'Alasan pengecualian wajib diisi'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setShowAlert(true)
      return
    }
    setErrors({})
    setShowAlert(false)
    setLoading(true)

    const payload = {
      lead_id: leadId,
      event_name: eventName || null,
      event_date: eventDate,
      event_time: eventTime || null,
      order_type: orderType || null,
      order_category: orderCategory || null,
      venue: venue || null,
      pax: parseInt(pax, 10),
      segmen: segmen as SegmenEnum | null,
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

  const invalidFields = Object.keys(errors)

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Alert ringkasan validasi */}
        {showAlert && invalidFields.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Periksa kembali isian Anda</AlertTitle>
            <AlertDescription>
              Field wajib belum lengkap:{' '}
              <span className="font-medium">
                {invalidFields.map((k) => FIELD_LABELS[k] ?? k).join(', ')}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Seksi: Klien & Segmen */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Klien &amp; Segmen</h3>
            <p className="text-xs text-slate-400">Pilih klien dan segmen order</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="lead">
                Klien (Lead) <span className="text-red-500">*</span>
              </Label>
              <Combobox
                id="lead"
                options={leadOptions}
                value={leadId}
                onChange={(v) => {
                  setLeadId(v)
                  clearError('leadId')
                }}
                placeholder="Pilih klien..."
                searchPlaceholder="Cari nama klien..."
                emptyText="Klien tidak ditemukan."
                error={!!errors.leadId}
              />
              {errors.leadId && <p className="text-xs text-red-500">{errors.leadId}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Segmen</Label>
              <div className="flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
                {segmen ? (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      SEGMEN_COLORS[segmen]
                    )}
                  >
                    {segmen}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">
                    {leadId ? 'Klien belum punya segmen' : 'Otomatis dari klien'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Mengikuti segmen klien · otomatis</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Seksi: Detail Event */}
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Detail Event</h3>
            <p className="text-xs text-slate-400">Informasi acara yang dipesan</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event_name">Nama Event</Label>
            <Input
              id="event_name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Training Annual, Annual Gathering, dll"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="event_date">
                Tanggal Event <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event_date"
                type="date"
                value={eventDate}
                onChange={(e) => {
                  setEventDate(e.target.value)
                  clearError('eventDate')
                }}
                className={cn(errors.eventDate && errorInput)}
              />
              {errors.eventDate && <p className="text-xs text-red-500">{errors.eventDate}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="event_time">Waktu Kegiatan</Label>
              <Input
                id="event_time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="08:00 - 17:00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pax">
                Jumlah Pax <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pax"
                type="number"
                min={1}
                value={pax}
                onChange={(e) => {
                  setPax(e.target.value)
                  clearError('pax')
                }}
                placeholder="100"
                className={cn(errors.pax && errorInput)}
              />
              {errors.pax && <p className="text-xs text-red-500">{errors.pax}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="order_type">
                Tipe Order <span className="text-red-500">*</span>
              </Label>
              <Combobox
                id="order_type"
                options={orderTypeOptions}
                value={orderType}
                onChange={(v) => {
                  setOrderType(v)
                  setOrderCategory('')
                  clearError('orderType')
                  clearError('orderCategory')
                }}
                placeholder="Pilih tipe order..."
                searchPlaceholder="Cari tipe..."
                emptyText="Tipe tidak ditemukan."
                error={!!errors.orderType}
              />
              {errors.orderType && <p className="text-xs text-red-500">{errors.orderType}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order_category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Combobox
                id="order_category"
                options={categoryOptions}
                value={orderCategory}
                onChange={(v) => {
                  setOrderCategory(v)
                  clearError('orderCategory')
                }}
                placeholder={orderType ? 'Pilih kategori...' : 'Pilih tipe dulu'}
                searchPlaceholder="Cari kategori..."
                emptyText="Kategori tidak ditemukan."
                error={!!errors.orderCategory}
                disabled={!orderType}
              />
              {errors.orderCategory && (
                <p className="text-xs text-red-500">{errors.orderCategory}</p>
              )}
            </div>
          </div>
          {orderType && (
            <p className="text-xs text-slate-500">
              Service Charge:{' '}
              <span className="font-medium text-slate-700">
                {serviceChargePctForType(orderType)}%
              </span>{' '}
              (mengikuti tipe order, otomatis di LoA)
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="venue">Venue / Lokasi</Label>
            <Textarea
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              rows={2}
              placeholder="Nama gedung, alamat venue"
            />
          </div>
        </section>

        <Separator />

        {/* Seksi: Pengecualian */}
        <section className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Pengecualian</h3>
            <p className="text-xs text-slate-400">Tandai bila order di luar SOP normal</p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isException}
              onChange={(e) => {
                setIsException(e.target.checked)
                if (e.target.checked === false) clearError('exceptionReason')
              }}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium text-slate-700">Order Pengecualian</span>
            <span className="text-slate-400">(di luar SOP normal)</span>
          </label>
          {isException && (
            <div className="space-y-1.5 pl-6">
              <Label htmlFor="exception_reason">
                Alasan Pengecualian <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="exception_reason"
                value={exceptionReason}
                onChange={(e) => {
                  setExceptionReason(e.target.value)
                  clearError('exceptionReason')
                }}
                rows={2}
                placeholder="Jelaskan alasan pengecualian"
                className={cn(errors.exceptionReason && errorInput)}
              />
              {errors.exceptionReason && (
                <p className="text-xs text-red-500">{errors.exceptionReason}</p>
              )}
            </div>
          )}
        </section>

        <Separator />

        {/* Aksi */}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
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
      </div>
    </form>
  )
}
