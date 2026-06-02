import { cache } from 'react'
import type { AppUser, Permissions } from '@/types/domain'
import { createClient } from '@/lib/supabase/server'

export function checkPermission(
  user: AppUser,
  permission: keyof Permissions
): boolean {
  return user.permissions[permission] === true
}

// Di-cache dalam satu request — Layout dan Page tidak akan duplikasi query
// React `cache()` dedupe pemanggilan dalam request scope yang sama
export const getAppUser = cache(async (): Promise<AppUser | null> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)')
    .eq('id', user.id)
    .single()

  if (error || !data || !data.is_active) return null

  return {
    ...data,
    role: data.roles as AppUser['role'],
    permissions: (data.roles?.permissions ?? {}) as Permissions,
  }
})
