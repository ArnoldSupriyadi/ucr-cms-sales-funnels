'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth/permissions'
import type { ActionResult } from '@/types/domain'

export async function updateProfile(data: {
  name: string
  phone: string | null
  jabatan: string | null
}): Promise<ActionResult> {
  const user = await getAppUser()
  if (!user) return { success: false, error: 'Tidak terautentikasi' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('users')
    .update({
      name: data.name,
      phone: data.phone || null,
      jabatan: data.jabatan || null,
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/settings/profile')
  return { success: true, data: undefined }
}
