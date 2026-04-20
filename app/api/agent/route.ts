import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as skills from '@/lib/agent/skills'

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
      }, { status: 401 })
    }

    const body = await request.json()
    const { skill, params } = body

    if (!skill || !params) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Missing skill or params',
        code: 'BAD_REQUEST',
      }, { status: 400 })
    }

    // Call the appropriate skill
    let result: AgentResponse<any>

    switch (skill) {
      case 'checkAvailability':
        result = await skills.checkAvailability(
          params.roomId,
          params.date,
          params.startTime,
          params.endTime
        )
        break

      case 'detectConflicts':
        result = await skills.detectConflicts(
          params.instructorId,
          params.date,
          params.roomId
        )
        break

      case 'bookRoom':
        result = await skills.bookRoom(
          params.roomId,
          user.id, // Use authenticated user ID
          params.className,
          params.date,
          params.startTime,
          params.endTime
        )
        break

      case 'getSchedule':
        result = await skills.getSchedule(
          new Date(params.weekStartDate),
          params.roomId,
          params.instructorId
        )
        break

      case 'cancelBooking':
        result = await skills.cancelBooking(
          params.bookingId,
          user.id // Use authenticated user ID
        )
        break

      default:
        return NextResponse.json<AgentResponse<null>>({
          success: false,
          error: 'Unknown skill',
          code: 'BAD_REQUEST',
        }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Agent API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}