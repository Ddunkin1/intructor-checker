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

export const schedule: ScheduleEntry[] = [
  {
    id: '1',
    subject: 'IT 381',
    title: 'App Dev & Emerging Tech',
    section: 'BSIT 3-IT32',
    days: ['M', 'TH'],
    startTime: '12:30',
    endTime: '15:00',
    room: 'CB 220',
    building: 'CB',
    instructor: 'Prof. TBD',
  },
  {
    id: '2',
    subject: 'IT 380',
    title: 'Fundamentals of Database',
    section: 'BSIT 3-IT32',
    days: ['T', 'TH'],
    startTime: '09:00',
    endTime: '11:30',
    room: 'CB 225',
    building: 'CB',
    instructor: 'Prof. TBD',
  },
  {
    id: '3',
    subject: 'IC-RES 130',
    title: 'Elements of Research',
    section: 'BSIT 3-IT32',
    days: ['T', 'F'],
    startTime: '13:30',
    endTime: '15:00',
    room: 'CB 407',
    building: 'CB',
    instructor: 'Prof. TBD',
  },
  {
    id: '4',
    subject: 'IT 382',
    title: 'Systems Admin & Maintenance',
    section: 'BSIT 3-IT32',
    days: ['M', 'TH'],
    startTime: '19:30',
    endTime: '21:00',
    room: 'CB 321',
    building: 'CB',
    instructor: 'Prof. TBD',
  },
  {
    id: '5',
    subject: 'IT 383-EL4',
    title: 'Web Systems & Tech',
    section: 'BSIT 3-IT32',
    days: ['M', 'TH'],
    startTime: '15:00',
    endTime: '17:30',
    room: 'CB 220',
    building: 'CB',
    instructor: 'Prof. TBD',
  },
]

export function getDayCode(date: Date): DayCode | null {
  return DOW_TO_DAY[date.getDay()] ?? null
}

export function getClassesForDay(dayCode: DayCode): ScheduleEntry[] {
  return schedule
    .filter(e => e.days.includes(dayCode))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function getClassesForBuilding(building: Building, dayCode?: DayCode): ScheduleEntry[] {
  return schedule.filter(
    e => e.building === building && (dayCode == null || e.days.includes(dayCode))
  )
}

export function getRoomsForBuilding(building: Building): string[] {
  return [...new Set(schedule.filter(e => e.building === building).map(e => e.room))].sort()
}

export function getClassesForRoom(room: string, dayCode: DayCode): ScheduleEntry[] {
  return schedule
    .filter(e => e.room === room && e.days.includes(dayCode))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}
