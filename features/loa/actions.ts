'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { generateLoaDocNo } from '@/lib/loa/doc-no'
import { calculateLoa } from '@/lib/loa/calculations'
import { serviceChargePctForType } from '@/lib/constants/order-type'
import type { ActionResult } from '@/types/domain'
import type { LoaWizardState, SavedLoaDraft, EventDraft } from './types'

/**
 * Simpan draft LOA: re-kalkulasi server (basis Σ amount Header, SC dari tipe order),
 * upsert header `loa`, lalu delete-and-reinsert pohon events → headers → subgroups → menu_items.
 * 1 order = 1 LOA (UNIQUE booking_id).
 */
export async function saveLoaDraft(
  orderId: string,
  state: LoaWizardState
): Promise<ActionResult<{ id: string; doc_no: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['loa.create']) return { success: false, error: 'Tidak ada izin' }

  const headers = state.events.flatMap((e) => e.headers)
  if (headers.length === 0) return { success: false, error: 'Minimal 1 header menu' }

  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('id, sales_id, order_type')
    .eq('id', orderId)
    .single()
  if (!order) return { success: false, error: 'Order tidak ditemukan' }
  if (!user.permissions['orders.view_all'] && order.sales_id !== user.id) {
    return { success: false, error: 'Bukan order Anda' }
  }

  const scPct = serviceChargePctForType(order.order_type)
  if (scPct <= 0) {
    return { success: false, error: 'Tipe order belum diisi — pilih tipe order dulu sebelum simpan LOA' }
  }

  // amount = harga/pax → total baris = amount × pax; Sub Total 1 = Σ total baris
  const calc = calculateLoa(headers.map((h) => h.amount * h.pax), { ...state.pricing, scPct })

  const { data: existing } = await supabase
    .from('loa')
    .select('id, doc_no')
    .eq('booking_id', orderId)
    .maybeSingle()

  const docNo = existing?.doc_no ?? (await generateLoaDocNo())

  const loaPayload = {
    booking_id: orderId,
    doc_no: docNo,
    status: 'draft' as const,
    setup_location: null,
    service_charge_pct: scPct,
    handling_fee_type: state.pricing.handlingType,
    handling_fee_value: state.pricing.handlingValue,
    handling_fee_pct: state.pricing.handlingType === 'percent' ? state.pricing.handlingValue : 0,
    discount_type: state.pricing.discountType,
    discount_value: state.pricing.discountValue,
    discount: calc.discountAmt,
    sub_total_1: calc.subTotal1,
    service_charge_amt: calc.serviceChargeAmt,
    sub_total_2: calc.subTotal2,
    pb1_amt: calc.pb1Amt,
    handling_fee_amt: calc.handlingFeeAmt,
    grand_total: calc.grandTotal,
    net_revenue: calc.netRevenue,
    created_by: user.id,
  }

  let loaId: string
  if (existing) {
    const { error } = await supabase.from('loa').update(loaPayload).eq('id', existing.id)
    if (error) return { success: false, error: error.message }
    loaId = existing.id
    // Hapus pohon lama (CASCADE: header→subgroup/menu_items; event→header)
    await supabase.from('loa_items').delete().eq('loa_id', loaId)
    await supabase.from('loa_events').delete().eq('loa_id', loaId)
  } else {
    const { data, error } = await supabase.from('loa').insert(loaPayload).select('id').single()
    if (error || !data) return { success: false, error: error?.message ?? 'Gagal simpan LOA' }
    loaId = data.id
  }

  // Insert ulang pohon
  for (let ei = 0; ei < state.events.length; ei++) {
    const ev = state.events[ei]
    const { data: insEvent, error: evErr } = await supabase
      .from('loa_events')
      .insert({
        loa_id: loaId,
        event_date: ev.eventDate || null,
        serving_time: ev.servingTime || null,
        venue: ev.venue || null,
        setup_location: ev.setupLocation || null,
        pax: ev.pax || null,
        sort_order: ei,
      })
      .select('id')
      .single()
    if (evErr || !insEvent) return { success: false, error: evErr?.message ?? 'Gagal simpan event' }

    for (let hi = 0; hi < ev.headers.length; hi++) {
      const h = ev.headers[hi]
      const { data: insHeader, error: hErr } = await supabase
        .from('loa_items')
        .insert({
          loa_id: loaId,
          event_id: insEvent.id,
          name: h.name,
          keterangan: h.keterangan || null,
          pax: h.pax,
          amount: h.amount,
          sort_order: hi,
        })
        .select('id')
        .single()
      if (hErr || !insHeader) return { success: false, error: hErr?.message ?? 'Gagal simpan header' }

      // helper insert daftar item pada lokasi (header / section / subgroup)
      const insertItems = async (
        items: { name: string; keterangan: string }[],
        sectionId: string | null,
        subgroupId: string | null,
      ): Promise<string | null> => {
        for (let ii = 0; ii < items.length; ii++) {
          const it = items[ii]
          const { error } = await supabase.from('loa_menu_items').insert({
            header_id: insHeader.id,
            section_id: sectionId,
            subgroup_id: subgroupId,
            name: it.name,
            keterangan: it.keterangan || null,
            sort_order: ii,
          })
          if (error) return error.message
        }
        return null
      }

      // item langsung di header
      const eHdr = await insertItems(h.items, null, null)
      if (eHdr) return { success: false, error: eHdr }

      // sections (komponen) → item langsung + sub-kategori
      for (let si = 0; si < h.sections.length; si++) {
        const sec = h.sections[si]
        const { data: insSec, error: secErr } = await supabase
          .from('loa_sections')
          .insert({ header_id: insHeader.id, name: sec.name, keterangan: sec.keterangan || null, sort_order: si })
          .select('id')
          .single()
        if (secErr || !insSec) return { success: false, error: secErr?.message ?? 'Gagal simpan komponen' }

        const eSec = await insertItems(sec.items, insSec.id, null)
        if (eSec) return { success: false, error: eSec }

        for (let gi = 0; gi < sec.subGroups.length; gi++) {
          const sg = sec.subGroups[gi]
          const { data: insSub, error: subErr } = await supabase
            .from('loa_subgroups')
            .insert({ header_id: insHeader.id, section_id: insSec.id, name: sg.name, keterangan: sg.keterangan || null, sort_order: gi })
            .select('id')
            .single()
          if (subErr || !insSub) return { success: false, error: subErr?.message ?? 'Gagal simpan sub-kategori' }
          const eSub = await insertItems(sg.items, insSec.id, insSub.id)
          if (eSub) return { success: false, error: eSub }
        }
      }
    }
  }

  revalidatePath(`/orders/${orderId}/loa`)
  return { success: true, data: { id: loaId, doc_no: docNo } }
}

/** Muat draft LOA tersimpan → pohon EventDraft[] + pricing. */
export async function getLoaForEdit(orderId: string): Promise<SavedLoaDraft | null> {
  const supabase = await createClient()
  const { data: loa } = await supabase
    .from('loa')
    .select(`
      id, service_charge_pct, handling_fee_type, handling_fee_value, discount_type, discount_value,
      loa_events(
        id, event_date, serving_time, venue, setup_location, pax, sort_order,
        loa_items(
          id, name, keterangan, pax, amount, sort_order,
          loa_sections(id, name, keterangan, sort_order, loa_subgroups(id, name, keterangan, sort_order)),
          loa_menu_items(id, name, keterangan, sort_order, section_id, subgroup_id)
        )
      )
    `)
    .eq('booking_id', orderId)
    .maybeSingle()
  if (!loa) return null

  type RawMenuItem = { id: string; name: string; keterangan: string | null; sort_order: number; section_id: string | null; subgroup_id: string | null }
  type RawSubGroup = { id: string; name: string; keterangan: string | null; sort_order: number }
  type RawSection = { id: string; name: string; keterangan: string | null; sort_order: number; loa_subgroups: RawSubGroup[] }
  type RawHeader = {
    id: string; name: string; keterangan: string | null; pax: number; amount: number; sort_order: number
    loa_sections: RawSection[]; loa_menu_items: RawMenuItem[]
  }
  type RawEvent = {
    id: string; event_date: string | null; serving_time: string | null; venue: string | null
    setup_location: string | null; pax: number | null; sort_order: number; loa_items: RawHeader[]
  }

  const bySort = <T extends { sort_order: number }>(arr: T[]) => arr.slice().sort((a, b) => a.sort_order - b.sort_order)
  const toItems = (ms: RawMenuItem[]) => ms.map((m) => ({ key: crypto.randomUUID(), name: m.name, keterangan: m.keterangan ?? '' }))

  const events: EventDraft[] = bySort((loa.loa_events ?? []) as RawEvent[]).map((ev) => ({
    key: crypto.randomUUID(),
    eventDate: ev.event_date ?? '',
    servingTime: ev.serving_time ?? '',
    venue: ev.venue ?? '',
    setupLocation: ev.setup_location ?? '',
    pax: ev.pax ?? 0,
    headers: bySort(ev.loa_items ?? []).map((h) => {
      const menuItems = bySort(h.loa_menu_items ?? [])
      return {
        key: crypto.randomUUID(),
        name: h.name,
        keterangan: h.keterangan ?? '',
        pax: h.pax,
        amount: Number(h.amount),
        items: toItems(menuItems.filter((m) => m.section_id === null && m.subgroup_id === null)),
        sections: bySort(h.loa_sections ?? []).map((sec) => ({
          key: crypto.randomUUID(),
          name: sec.name,
          keterangan: sec.keterangan ?? '',
          items: toItems(menuItems.filter((m) => m.section_id === sec.id && m.subgroup_id === null)),
          subGroups: bySort(sec.loa_subgroups ?? []).map((sg) => ({
            key: crypto.randomUUID(),
            name: sg.name,
            keterangan: sg.keterangan ?? '',
            items: toItems(menuItems.filter((m) => m.subgroup_id === sg.id)),
          })),
        })),
      }
    }),
  }))

  const discountValue = Number(loa.discount_value)
  return {
    events,
    pricing: {
      scPct: Number(loa.service_charge_pct), // di-override di page dari tipe order
      handlingType: loa.handling_fee_type === 'flat' ? 'flat' : 'percent',
      handlingValue: Number(loa.handling_fee_value),
      discountEnabled: discountValue > 0,
      discountType: loa.discount_type === 'percent' ? 'percent' : 'flat',
      discountValue,
    },
  }
}
