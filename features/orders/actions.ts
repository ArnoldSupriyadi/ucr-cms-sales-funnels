'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { generateOrderNo } from '@/lib/utils/order-no'
import { ORDER_STATUS_TRANSITIONS } from '@/lib/constants/status'
import type { ActionResult, OrderStatus } from '@/types/domain'
import type { TablesInsert, TablesUpdate } from '@/types/database'

type OrderCreateInput = Omit<TablesInsert<'orders'>, 'order_no' | 'sales_id'>

export async function createOrder(
  data: OrderCreateInput
): Promise<ActionResult<{ id: string; order_no: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['orders.create']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const order_no = await generateOrderNo(data.event_date)

  const { data: booking, error } = await supabase
    .from('orders')
    .insert({
      ...data,
      order_no,
      sales_id: user.id,
      status: 'Tentative',
    })
    .select('id, order_no')
    .single()

  if (error) return { success: false, error: error.message }

  // Log initial status
  await supabase.from('order_status_logs').insert({
    order_id: booking.id,
    from_status: null,
    to_status: 'Tentative',
    changed_by: user.id,
    note: 'Order dibuat',
  })

  revalidatePath('/orders')
  return { success: true, data: booking }
}

export async function updateOrder(
  id: string,
  data: TablesUpdate<'orders'>
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['orders.edit']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const { error } = await supabase.from('orders').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/orders')
  revalidatePath(`/orders/${id}`)
  return { success: true, data: undefined }
}

export async function changeOrderStatus(
  orderId: string,
  toStatus: OrderStatus,
  note?: string
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['orders.edit']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()

  // Get current status
  const { data: booking } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  if (!booking) return { success: false, error: 'Order tidak ditemukan' }

  const currentStatus = booking.status as OrderStatus
  const allowed = ORDER_STATUS_TRANSITIONS[currentStatus]

  if (!allowed.includes(toStatus)) {
    return {
      success: false,
      error: `Tidak bisa mengubah status dari ${currentStatus} ke ${toStatus}`,
    }
  }

  // Require note for Cancel
  if (toStatus === 'Cancel' && !note?.trim()) {
    return { success: false, error: 'Alasan cancel wajib diisi' }
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: toStatus })
    .eq('id', orderId)

  if (updateError) return { success: false, error: updateError.message }

  await supabase.from('order_status_logs').insert({
    order_id: orderId,
    from_status: currentStatus,
    to_status: toStatus,
    changed_by: user.id,
    note: note || null,
  })

  revalidatePath('/orders')
  revalidatePath(`/orders/${orderId}`)
  return { success: true, data: undefined }
}
