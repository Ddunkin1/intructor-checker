import { createClient } from '@/lib/supabase/server'
import { getWeekStart } from '@/lib/utils/timeUtils'
import type { Database } from '@/lib/supabase/types'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  rooms?: Database['public']['Tables']['rooms']['Row']
  instructors?: Database['public']['Tables']['instructors']['Row']
}

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function getSchedule(
  weekStartDate: Date,
  roomId?: string,
  instructorId?: string
): Promise<AgentResponse<{
  schedule: Booking[]
  groupedByRoom: Record<string, Booking[]>
}>> {
  try {
    const supabase = await createClient()

    const startDate = getWeekStart(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6) // End of week (Sunday)

    let query = supabase
      .from('bookings')
      .select(`
        *,
        rooms:room_id(id, name, building),
        instructors:instructor_id(id, full_name, department)
      `)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date')
      .order('start_time')

    if (roomId) {
      query = query.eq('room_id', roomId)
    }

    if (instructorId) {
      query = query.eq('instructor_id', instructorId)
    }

    const { data: schedule, error } = await query

    if (error) {
      return {
        success: false,
        error: 'Failed to fetch schedule',
        code: 'DATABASE_ERROR',
      }
    }

    // Group by room
    const groupedByRoom: Record<string, Booking[]> = {}
    schedule.forEach(booking => {
      const roomId = booking.room_id
      if (!groupedByRoom[roomId]) {
        groupedByRoom[roomId] = []
      }
      groupedByRoom[roomId].push(booking)
    })

    return {
      success: true,
      data: {
        schedule,
        groupedByRoom,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }
  }
}