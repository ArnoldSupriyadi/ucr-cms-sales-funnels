import type { AppUser, Permissions } from '@/types/domain'
import { createClient } from '@/lib/supabase/server'

export function checkPermission(
  user: AppUser,
  permission: keyof Permissions
): boolean {
  return user.permissions[permission] === true
}

export async function getAppUser(): Promise<AppUser | null> {
  const supabase = await createClient()
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  
  if (userErr) {
    console.error('getAppUser: Error getting auth user:', userErr.message)
  }

  if (!user) {
    console.log('getAppUser: No authenticated user found in session cookies.')
    return null
  }

  console.log('getAppUser: Found authenticated user:', user.email, 'ID:', user.id)

  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('getAppUser: Error querying public.users table:', error.message)
    return null
  }

  if (!data) {
    console.warn('getAppUser: User record not found in public.users table for ID:', user.id)
    return null
  }

  if (!data.is_active) {
    console.warn('getAppUser: User record is marked as inactive:', user.email)
    return null
  }

  console.log('getAppUser: Successfully retrieved active user profile with role:', data.roles?.name)

  return {
    ...data,
    role: data.roles as AppUser['role'],
    permissions: (data.roles?.permissions ?? {}) as Permissions,
  }
}
