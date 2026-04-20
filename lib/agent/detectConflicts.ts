import { createClient } from '@/lib/supabase/server'
import { timesOverlap } from '@/lib/utils/timeUtils'
import type { Database } from '@/lib/supabase/types'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  rooms?: Database['public']['Tables']['rooms']['Row']
  instructors?: Database['public']['Tables']['instructors']['Row']
}

type ConflictPair = {
  booking1: Booking
  booking2: Booking
  reason: 'overlap' | 'double_booking'
}

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function detectConflicts(
  instructorId?: string,
  date?: string,
  roomId?: string
): Promise<AgentResponse<{ conflicts: ConflictPair[]; total: number }>> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('bookings')
      .select(`
        *,
        rooms:room_id(id, name, building),
        instructors:instructor_id(id, full_name, department)
      `)

    if (instructorId) {
      query = query.eq('instructor_id', instructorId)
    }

    if (date) {
      query = query.eq('date', date)
    }

    if (roomId) {
      query = query.eq('room_id', roomId)
    }

    const { data: bookings, error } = await query.order('date').order('start_time')

    if (error) {
      return {
        success: false,
        error: 'Failed to detect conflicts',
        code: 'DATABASE_ERROR',
      }
    }

    const conflicts: ConflictPair[] = []

    // Check for overlapping bookings
    for (let i = 0; i < bookings.length; i++) {
      for (let j = i + 1; j < bookings.length; j++) {
        const booking1 = bookings[i]
        const booking2 = bookings[j]

        // Same room and date
        if (booking1.room_id === booking2.room_id && booking1.date === booking2.date) {
          if (timesOverlap(booking1.start_time, booking1.end_time, booking2.start_time, booking2.end_time)) {
            conflicts.push({
              booking1,
              booking2,
              reason: 'overlap',
            })
          }
        }

        // Same instructor at same time (different rooms)
        if (booking1.instructor_id === booking2.instructor_id &&
            booking1.date === booking2.date &&
            timesOverlap(booking1.start_time, booking1.end_time, booking2.start_time, booking2.end_time)) {
          conflicts.push({
            booking1,
            booking2,
            reason: 'double_booking',
          })
        }
      }
    }

    return {
      success: true,
      data: {
        conflicts,
        total: conflicts.length,
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