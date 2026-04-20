import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { bookRoom, getSchedule, cancelBooking } from '@/lib/agent/skills'

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
    console.error('Bookings GET API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { roomId, className, date, startTime, endTime } = body

    if (!roomId || !className || !date || !startTime || !endTime) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Missing required fields',
        code: 'BAD_REQUEST',
      }, { status: 400 })
    }

    const result = await bookRoom(
      roomId,
      user.id,
      className,
      date,
      startTime,
      endTime
    )

    if (!result.success) {
      const statusCode = result.code === 'ROOM_UNAVAILABLE' ? 409 : 500
      return NextResponse.json(result, { status: statusCode })
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Bookings POST API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json<AgentResponse<null>>({
        success: false,
        error: 'Booking ID is required',
        code: 'BAD_REQUEST',
      }, { status: 400 })
    }

    const result = await cancelBooking(bookingId, user.id)

    if (!result.success) {
      const statusCode = result.code === 'UNAUTHORIZED' ? 403 :
                        result.code === 'NOT_FOUND' ? 404 : 500
      return NextResponse.json(result, { status: statusCode })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Bookings DELETE API error:', error)
    return NextResponse.json<AgentResponse<null>>({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 })
  }
}