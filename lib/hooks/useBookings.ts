import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { previewBookings } from '@/lib/data/previewData'

export function useBookings(filters?: {
  roomId?: string
  instructorId?: string
  date?: string
}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      try {
        const supabase = createClient()
        let query = supabase
          .from('bookings')
          .select(`
            *,
            rooms:room_id(name, building),
            instructors:instructor_id(full_name, department)
          `)
          .order('date', { ascending: false })
          .order('start_time', { ascending: true })

        if (filters?.roomId) {
          query = query.eq('room_id', filters.roomId)
        }

        if (filters?.instructorId) {
          query = query.eq('instructor_id', filters.instructorId)
        }

        if (filters?.date) {
          query = query.eq('date', filters.date)
        }

        const { data, error } = await query

        if (error || !data) {
          throw error || new Error('No bookings data')
        }

        return data
      } catch {
        return previewBookings.filter((booking) => {
          if (filters?.roomId && booking.room_id !== filters.roomId) {
            return false
          }
          if (filters?.instructorId && booking.instructor_id !== filters.instructorId) {
            return false
          }
          if (filters?.date && booking.date !== filters.date) {
            return false
          }
          return true
        })
      }
    },
  })
}