'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { generateLoaDocNo } from '@/lib/loa/doc-no'
import { calculateLoa } from '@/lib/loa/calculations'
import { generateMenuDetail } from '@/lib/loa/menu-detail'
import type { ActionResult } from '@/types/domain'
import type { LoaWizardState, SavedLoaDraft } from './types'

/**
 * Simpan draft LoA secara atomik: re-validasi + re-kalkulasi di server (jangan
 * percaya angka client), upsert header `loa`, lalu delete-and-reinsert
 * `loa_items` + `loa_item_selections`. 1 order = 1 LoA (UNIQUE booking_id).
 */
export async function saveLoaDraft(
  orderId: string,
  state: LoaWizardState
): Promise<ActionResult<{ id: string; doc_no: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['loa.create']) return { success: false, error: 'Tidak ada izin' }
  if (state.items.length === 0) return { success: false, error: 'Minimal 1 item' }

  const supabase = await createClient()

  // Pastikan order ada & milik sales ini (lapis kedua di server)
  const { data: order } = await supabase
    .from('orders')
    .select('id, sales_id')
    .eq('id', orderId)
    .single()
  if (!order) return { success: false, error: 'Order tidak ditemukan' }
  if (!user.permissions['orders.view_all'] && order.sales_id !== user.id) {
    return { success: false, error: 'Bukan order Anda' }
  }

  // Re-kalkulasi di server — sama persis dgn client (calculateLoa(items, pricing))
  const calc = calculateLoa(
    state.items.map((i) => ({ pricePerPax: i.pricePerPax, pax: i.pax })),
    state.pricing
  )

  // Cek LoA existing (1:1 dengan order)
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
    setup_location: state.detail.setupLocation || null,
    service_charge_pct: state.pricing.scPct,
    handling_fee_pct: state.pricing.handlingPct,
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

  // Upsert header
  let loaId: string
  if (existing) {
    const { error } = await supabase.from('loa').update(loaPayload).eq('id', existing.id)
    if (error) return { success: false, error: error.message }
    loaId = existing.id
    // Hapus anak lama (CASCADE menghapus selections)
    await supabase.from('loa_items').delete().eq('loa_id', loaId)
  } else {
    const { data, error } = await supabase.from('loa').insert(loaPayload).select('id').single()
    if (error || !data) return { success: false, error: error?.message ?? 'Gagal simpan LoA' }
    loaId = data.id
  }

  // Insert ulang items + selections
  for (let idx = 0; idx < state.items.length; idx++) {
    const item = state.items[idx]
    const amount = Math.round(item.pricePerPax * item.pax * 100) / 100
    const { data: insItem, error: itemErr } = await supabase
      .from('loa_items')
      .insert({
        loa_id: loaId,
        package_name: item.packageName,
        menu_detail: generateMenuDetail(
          item.selections.map((s) => ({
            componentName: s.componentName,
            occasionNo: s.occasionNo,
            categoryName: s.categoryName,
            itemName: s.itemName,
          }))
        ),
        price_per_pax: item.pricePerPax,
        pax: item.pax,
        amount,
        sort_order: idx,
      })
      .select('id')
      .single()
    if (itemErr || !insItem) return { success: false, error: itemErr?.message ?? 'Gagal simpan item' }

    if (item.selections.length > 0) {
      const { error: selErr } = await supabase.from('loa_item_selections').insert(
        item.selections.map((s, sIdx) => ({
          loa_item_id: insItem.id,
          component_name: s.componentName,
          occasion_no: s.occasionNo,
          category_name: s.categoryName,
          item_name: s.itemName,
          sort_order: sIdx,
        }))
      )
      if (selErr) return { success: false, error: selErr.message }
    }
  }

  revalidatePath(`/orders/${orderId}/loa`)
  return { success: true, data: { id: loaId, doc_no: docNo } }
}

/**
 * Muat draft LoA tersimpan (jika ada) untuk re-hydrate wizard. Hanya bagian
 * yang dipersist di LoA: setup_location, items, pricing. Detail event lain
 * (nama, tanggal, dll) tetap bersumber dari order di halaman.
 */
export async function getLoaForEdit(orderId: string): Promise<SavedLoaDraft | null> {
  const supabase = await createClient()
  const { data: loa } = await supabase
    .from('loa')
    .select(
      'id, setup_location, service_charge_pct, handling_fee_pct, discount_type, discount_value, loa_items(id, package_name, price_per_pax, pax, sort_order, loa_item_selections(component_name, occasion_no, category_name, item_name, sort_order))'
    )
    .eq('booking_id', orderId)
    .maybeSingle()
  if (!loa) return null

  type RawSelection = {
    component_name: string
    occasion_no: number
    category_name: string
    item_name: string
    sort_order: number
  }
  type RawItem = {
    id: string
    package_name: string
    price_per_pax: number
    pax: number
    sort_order: number
    loa_item_selections: RawSelection[]
  }

  const items = (loa.loa_items as RawItem[])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((it) => ({
      key: crypto.randomUUID(),
      packageId: null,
      packageName: it.package_name,
      pricePerPax: Number(it.price_per_pax),
      pax: it.pax,
      selections: (it.loa_item_selections ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => ({
          componentName: s.component_name,
          occasionNo: s.occasion_no,
          categoryId: '',
          categoryName: s.category_name,
          itemId: '',
          itemName: s.item_name,
        })),
    }))

  const discountValue = Number(loa.discount_value)
  return {
    setupLocation: loa.setup_location ?? '',
    items,
    pricing: {
      scPct: Number(loa.service_charge_pct),
      handlingPct: Number(loa.handling_fee_pct),
      discountEnabled: discountValue > 0,
      discountType: loa.discount_type === 'percent' ? 'percent' : 'flat',
      discountValue,
    },
  }
}
