import { createClient } from '@/lib/supabase/server'
import { ScheduleEntry, DayCode, Building } from '@/lib/data/scheduleData'
import type { Database } from '@/lib/supabase/types'

type ScheduleEntryRow = Database['public']['Tables']['schedule_entries']['Row']

function rowToEntry(row: ScheduleEntryRow): ScheduleEntry {
  return {
    id: row.id,
    subject: row.subject,
    title: row.title,
    section: row.section,
    days: row.days as DayCode[],
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    room: row.room,
    building: row.building as Building,
    instructor: row.instructor_name,
  }
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('schedule_entries')
      .select('*')
      .order('start_time')
      .limit(10000)
    if (error) { console.error('[getScheduleEntries]', error.message, error.code); return [] }
    if (!data) return []
    return (data as ScheduleEntryRow[]).map(rowToEntry)
  } catch (err) {
    console.error('[getScheduleEntries] unexpected error:', err)
    return []
  }
}

export async function getEntriesForBuilding(
  building: Building,
  dayCode?: DayCode
): Promise<ScheduleEntry[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('schedule_entries')
      .select('*')
      .eq('building', building)
      .order('start_time')
    if (dayCode) {
      query = query.contains('days', [dayCode])
    }
    const { data, error } = await query.limit(10000)
    if (error) { console.error('[getEntriesForBuilding]', error.message, error.code); return [] }
    if (!data) return []
    return (data as ScheduleEntryRow[]).map(rowToEntry)
  } catch (err) {
    console.error('[getEntriesForBuilding] unexpected error:', err)
    return []
  }
}

export async function getEntriesForRoom(
  room: string,
  dayCode: DayCode
): Promise<ScheduleEntry[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('schedule_entries')
      .select('*')
      .eq('room', room)
      .contains('days', [dayCode])
      .order('start_time')
    if (error) { console.error('[getEntriesForRoom]', error.message, error.code); return [] }
    if (!data) return []
    return (data as ScheduleEntryRow[]).map(rowToEntry)
  } catch (err) {
    console.error('[getEntriesForRoom] unexpected error:', err)
    return []
  }
}

export async function getEntriesForInstructor(name: string): Promise<ScheduleEntry[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('schedule_entries')
      .select('*')
      .eq('instructor_name', name)
      .order('start_time')
    if (error) { console.error('[getEntriesForInstructor]', error.message, error.code); return [] }
    if (!data) return []
    return (data as ScheduleEntryRow[]).map(rowToEntry)
  } catch (err) {
    console.error('[getEntriesForInstructor] unexpected error:', err)
    return []
  }
}

export async function getInstructors(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('schedule_entries')
      .select('instructor_name')
    if (error) { console.error('[getInstructors]', error.message, error.code); return [] }
    if (!data) return []
    return [...new Set((data as Pick<ScheduleEntryRow, 'instructor_name'>[]).map(r => r.instructor_name))].sort()
  } catch (err) {
    console.error('[getInstructors] unexpected error:', err)
    return []
  }
}
