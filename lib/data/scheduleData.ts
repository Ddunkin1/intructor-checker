export type DayCode = 'M' | 'T' | 'W' | 'TH' | 'F'
export type Building = 'CB' | 'CBS' | 'CBE'

export interface ScheduleEntry {
  id: string
  subject: string
  title: string
  section: string
  days: DayCode[]
  startTime: string
  endTime: string
  room: string
  building: Building
  instructor: string
}

const DOW_TO_DAY: Record<number, DayCode> = {
  1: 'M',
  2: 'T',
  3: 'W',
  4: 'TH',
  5: 'F',
}

export const BUILDINGS: { id: Building; label: string }[] = [
  { id: 'CB', label: 'CB' },
  { id: 'CBS', label: 'CBS' },
  { id: 'CBE', label: 'CBE' },
]

export const ALL_DAYS: { code: DayCode; label: string }[] = [
  { code: 'M', label: 'Mon' },
  { code: 'T', label: 'Tue' },
  { code: 'W', label: 'Wed' },
  { code: 'TH', label: 'Thu' },
  { code: 'F', label: 'Fri' },
]

export function getDayCode(date: Date): DayCode | null {
  return DOW_TO_DAY[date.getDay()] ?? null
}
