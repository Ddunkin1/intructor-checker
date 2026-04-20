import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSchedule } from '@/lib/agent/skills'

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weekStartDate = searchParams.get('weekStartDate')
    const roomId = searchParams.get('roomId')
    const instructorId = searchParams.get('instructorId')

    if (!weekStartDate) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'weekStartDate parameter is required',
        code: 'BAD_REQUEST',
      }, { status: 400 })
    }

    const result = await getSchedule(
      new Date(weekStartDate),
      roomId || undefined,
      instructorId || undefined
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Schedule API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}