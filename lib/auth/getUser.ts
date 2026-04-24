import { createClient } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  isAdmin: boolean
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('instructors')
    .select('full_name, is_admin')
    .eq('id', user.id)
    .single()

  if (error) console.error('[getUser] instructor query error:', error.message, error.code)

  const instructor = data as { full_name: string; is_admin: boolean } | null

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: instructor?.full_name ?? user.email ?? 'Instructor',
    isAdmin: instructor?.is_admin ?? false,
  }
}
