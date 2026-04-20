import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getWeekStart } from '@/lib/utils/timeUtils'
import { previewBookings } from '@/lib/data/previewData'

export function useSchedule(weekStartDate?: Date) {
  const startDate = weekStartDate || getWeekStart(new Date())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6) // End of week (Sunday)

  return useQuery({
    queryKey: ['schedule', startDate.toISOString()],
    queryFn: async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
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

        if (error || !data) {
          throw error || new Error('No schedule data')
        }

        const groupedByRoom: Record<string, typeof data> = {}
        data.forEach((booking) => {
          const roomId = booking.rooms?.id
          if (roomId) {
            if (!groupedByRoom[roomId]) {
              groupedByRoom[roomId] = []
            }
            groupedByRoom[roomId].push(booking)
          }
        })

        return {
          schedule: data,
          groupedByRoom,
          weekStart: startDate,
          weekEnd: endDate,
        }
      } catch {
        const fallbackBookings = previewBookings.filter((booking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= startDate && bookingDate <= endDate
        })

        const groupedByRoom: Record<string, typeof fallbackBookings> = {}
        fallbackBookings.forEach((booking) => {
          const roomId = booking.room_id
          if (!groupedByRoom[roomId]) {
            groupedByRoom[roomId] = []
          }
          groupedByRoom[roomId].push(booking)
        })

        return {
          schedule: fallbackBookings,
          groupedByRoom,
          weekStart: startDate,
          weekEnd: endDate,
        }
      }
    },
  })
}
