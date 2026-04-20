import { createClient } from '@/lib/supabase/server'
import { checkAvailability } from './checkAvailability'
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

export async function bookRoom(
  roomId: string,
  instructorId: string,
  className: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<AgentResponse<{ booking: Booking }>> {
  try {
    // First check availability
    const availabilityCheck = await checkAvailability(roomId, date, startTime, endTime)

    if (!availabilityCheck.success || !availabilityCheck.data?.available) {
      return {
        success: false,
        error: 'Room is not available at this time',
        code: 'ROOM_UNAVAILABLE',
      }
    }

    const supabase = await createClient()

    // Create the booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        room_id: roomId,
        instructor_id: instructorId,
        class_name: className,
        date,
        start_time: startTime,
        end_time: endTime,
      })
      .select(`
        *,
        rooms:room_id(id, name, building),
        instructors:instructor_id(id, full_name, department)
      `)
      .single()

    if (error) {
      // Check if it's a constraint violation (double booking)
      if (error.code === '23505') { // unique_violation
        return {
          success: false,
          error: 'Room is already booked for this time slot',
          code: 'ROOM_UNAVAILABLE',
        }
      }

      return {
        success: false,
        error: 'Failed to create booking',
        code: 'DATABASE_ERROR',
      }
    }

    return {
      success: true,
      data: { booking },
    }
  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }
  }
}