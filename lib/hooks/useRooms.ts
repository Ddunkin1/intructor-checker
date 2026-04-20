import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { previewRooms } from '@/lib/data/previewData'

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

      if (error || !data || data.length === 0) {
        return previewRooms
      }
      return data
    },
  })
}