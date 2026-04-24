import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getUser } from '@/lib/auth/getUser'

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!key) throw new Error('Service role key not configured')
  return createServiceClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!caller.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { fullName, department, isAdmin, newPassword } = await request.json()

  if (!fullName?.trim()) {
    return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
  }

  if (newPassword !== undefined && newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  let admin
  try { admin = serviceClient() } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  const { error } = await admin
    .from('instructors')
    .update({
      full_name: fullName.trim(),
      department: department?.trim() || null,
      is_admin: isAdmin ?? false,
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (newPassword) {
    const { error: pwError } = await admin.auth.admin.updateUserById(id, {
      password: newPassword,
    })
    if (pwError) return NextResponse.json({ error: pwError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!caller.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  if (id === caller.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceKey) {
    return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
  }

  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error: authError } = await admin.auth.admin.deleteUser(id)

  if (authError) {
    // Auth user may not exist — delete directly from instructors table
    const { error: dbError } = await admin
      .from('instructors')
      .delete()
      .eq('id', id)
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
