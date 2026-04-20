import { createClient } from '@/lib/supabase/server'

type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export async function cancelBooking(
  bookingId: string,
  requestingUserId: string
): Promise<AgentResponse<{}>> {
  try {
    const supabase = await createClient()

    // First check if the booking exists and get its details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('instructor_id')
      .eq('id', bookingId)
      .single()

    if (fetchError) {
      return {
        success: false,
        error: 'Booking not found',
        code: 'NOT_FOUND',
      }
    }

    // Check if user is authorized (owner or admin)
    const { data: instructor, error: instructorError } = await supabase
      .from('instructors')
      .select('is_admin')
      .eq('id', requestingUserId)
      .single()

    if (instructorError) {
      return {
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      }
    }

    const isOwner = booking.instructor_id === requestingUserId
    const isAdmin = instructor.is_admin

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: 'You can only cancel your own bookings',
        code: 'UNAUTHORIZED',
      }
    }

    // Delete the booking
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)

    if (deleteError) {
      return {
        success: false,
        error: 'Failed to cancel booking',
        code: 'DATABASE_ERROR',
      }
    }

    return {
      success: true,
      data: {},
    }
  } catch (error) {
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }
  }
}