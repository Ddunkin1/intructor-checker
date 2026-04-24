import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getUser } from '@/lib/auth/getUser'
import { getScheduleEntries } from '@/lib/data/supabaseSchedule'

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!key) throw new Error('Service role key not configured')
  return createServiceClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function GET() {
  const caller = await getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!caller.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const entries = await getScheduleEntries()
  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const caller = await getUser()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!caller.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()

  let admin
  try { admin = serviceClient() } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  const { data, error } = await admin
    .from('schedule_entries')
    .insert({
      subject: body.subject,
      title: body.title ?? '',
      section: body.section,
      instructor_name: body.instructor,
      building: body.building,
      room: body.room,
      days: body.days,
      start_time: body.startTime,
      end_time: body.endTime,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
