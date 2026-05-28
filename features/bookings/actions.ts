'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import { generateBookingNo } from '@/lib/utils/booking-no'
import { BOOKING_STATUS_TRANSITIONS } from '@/lib/constants/status'
import type { ActionResult, BookingStatus } from '@/types/domain'
import type { TablesInsert, TablesUpdate } from '@/types/database'

type BookingCreateInput = Omit<TablesInsert<'bookings'>, 'booking_no' | 'sales_id'>

export async function createBooking(
  data: BookingCreateInput
): Promise<ActionResult<{ id: string; booking_no: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['bookings.create']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const booking_no = await generateBookingNo(data.event_date)

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      ...data,
      booking_no,
      sales_id: user.id,
      status: 'Tentative',
    })
    .select('id, booking_no')
    .single()

  if (error) return { success: false, error: error.message }

  // Log initial status
  await supabase.from('booking_status_logs').insert({
    booking_id: booking.id,
    from_status: null,
    to_status: 'Tentative',
    changed_by: user.id,
    note: 'Booking dibuat',
  })

  revalidatePath('/bookings')
  return { success: true, data: booking }
}

export async function updateBooking(
  id: string,
  data: TablesUpdate<'bookings'>
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['bookings.edit']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const { error } = await supabase.from('bookings').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/bookings')
  revalidatePath(`/bookings/${id}`)
  return { success: true, data: undefined }
}

export async function changeBookingStatus(
  bookingId: string,
  toStatus: BookingStatus,
  note?: string
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['bookings.edit']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()

  // Get current status
  const { data: booking } = await supabase
    .from('bookings')
    .select('status')
    .eq('id', bookingId)
    .single()

  if (!booking) return { success: false, error: 'Booking tidak ditemukan' }

  const currentStatus = booking.status as BookingStatus
  const allowed = BOOKING_STATUS_TRANSITIONS[currentStatus]

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
    .from('bookings')
    .update({ status: toStatus })
    .eq('id', bookingId)

  if (updateError) return { success: false, error: updateError.message }

  await supabase.from('booking_status_logs').insert({
    booking_id: bookingId,
    from_status: currentStatus,
    to_status: toStatus,
    changed_by: user.id,
    note: note || null,
  })

  revalidatePath('/bookings')
  revalidatePath(`/bookings/${bookingId}`)
  return { success: true, data: undefined }
}
