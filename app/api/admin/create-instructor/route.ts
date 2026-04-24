import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getUser } from '@/lib/auth/getUser'

export async function POST(request: Request) {
  const caller = await getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!caller.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { fullName, email, password, department } = await request.json()

  if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: 'fullName, email, and password are required' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceKey) {
    return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
  }

  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim(),
    password: password.trim(),
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const { error: dbError } = await admin
    .from('instructors')
    .insert({
      id: authData.user.id,
      full_name: fullName.trim(),
      email: email.trim(),
      department: department?.trim() ?? null,
      is_admin: false,
    })

  if (dbError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ id: authData.user.id })
}
