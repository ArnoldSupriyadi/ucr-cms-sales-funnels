'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import type { ActionResult } from '@/types/domain'
import type { TablesInsert, TablesUpdate } from '@/types/database'

// ---- Leads ----

export async function createLead(
  data: Omit<TablesInsert<'leads'>, 'sales_id'>
): Promise<ActionResult<{ id: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['leads.create']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const { data: lead, error } = await supabase
    .from('leads')
    .insert({ ...data, sales_id: user.id })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/leads')
  return { success: true, data: lead }
}

export async function updateLead(
  id: string,
  data: TablesUpdate<'leads'>
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['leads.edit']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const { error } = await supabase.from('leads').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  return { success: true, data: undefined }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }
  if (!user.permissions['leads.delete']) return { success: false, error: 'Tidak ada izin' }

  const supabase = await createClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/leads')
  return { success: true, data: undefined }
}

// ---- Lead Contacts ----

export async function createLeadContact(
  data: TablesInsert<'lead_contacts'>
): Promise<ActionResult<{ id: string }>> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const supabase = await createClient()

  // If setting as primary, unset existing primary first
  if (data.is_primary) {
    await supabase
      .from('lead_contacts')
      .update({ is_primary: false })
      .eq('lead_id', data.lead_id)
      .eq('is_primary', true)
  }

  const { data: contact, error } = await supabase
    .from('lead_contacts')
    .insert(data)
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath(`/leads/${data.lead_id}`)
  return { success: true, data: contact }
}

export async function updateLeadContact(
  id: string,
  leadId: string,
  data: TablesUpdate<'lead_contacts'>
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const supabase = await createClient()

  // If setting as primary, unset existing primary first
  if (data.is_primary) {
    await supabase
      .from('lead_contacts')
      .update({ is_primary: false })
      .eq('lead_id', leadId)
      .eq('is_primary', true)
      .neq('id', id)
  }

  const { error } = await supabase.from('lead_contacts').update(data).eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/leads/${leadId}`)
  return { success: true, data: undefined }
}

export async function deleteLeadContact(
  id: string,
  leadId: string
): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const supabase = await createClient()
  const { error } = await supabase.from('lead_contacts').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  revalidatePath(`/leads/${leadId}`)
  return { success: true, data: undefined }
}
