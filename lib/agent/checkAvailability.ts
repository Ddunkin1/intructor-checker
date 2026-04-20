import { createClient } from '@/lib/supabase/server'
import { timesOverlap } from '@/lib/utils/timeUtils'
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

export async function checkAvailability(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<AgentResponse<{ available: boolean; conflicts: Booking[] }>> {
  try {
    const supabase = await createClient()

    // Get all bookings for this room on this date
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms:room_id(id, name, building),
        instructors:instructor_id(id, full_name, department)
      `)
      .eq('room_id', roomId)
      .eq('date', date)

    if (error) {
      return {
        success: false,
        error: 'Failed to check availability',
        code: 'DATABASE_ERROR',
      }
    }

    // Check for conflicts
    const conflicts = bookings.filter(booking =>
      timesOverlap(startTime, endTime, booking.start_time, booking.end_time)
    )

    return {
      success: true,
      data: {
        available: conflicts.length === 0,
        conflicts,
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