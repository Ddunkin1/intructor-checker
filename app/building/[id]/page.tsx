import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  Building,
  ALL_DAYS,
  DayCode,
  getDayCode,
  getClassesForRoom,
  schedule,
  MY_INSTRUCTOR,
  ScheduleEntry,
} from '@/lib/data/scheduleData'
import { BuildingRooms, FloorData, FilterPill } from '@/components/BuildingRooms'

const FLOOR_DEFS = [
  { label: 'Ground Floor', min: 101, max: 125 },
  { label: '2nd Floor',    min: 201, max: 225 },
  { label: '3rd Floor',   min: 301, max: 325 },
  { label: '4th Floor',   min: 401, max: 425 },
]

const VALID_BUILDINGS: Building[] = ['CB', 'CBS', 'CBE']

const FAKE_INSTRUCTORS = [
  'Prof. Santos', 'Prof. Reyes', 'Prof. Cruz', 'Prof. Bautista',
  'Prof. Garcia', 'Prof. Torres', 'Prof. Flores', 'Prof. Villanueva',
  'Prof. Dela Cruz', 'Prof. Mendoza', 'Prof. Ramos', 'Prof. Aquino',
]
const FAKE_SUBJECTS = [
  'CC 100', 'IT 200', 'CS 101', 'IT 310', 'CC 201', 'CS 220',
  'IT 150', 'CC 310', 'CS 305', 'IT 420', 'CC 102', 'IT 230',
]
const ALL_SLOTS: [string, string][] = [
  ['07:30', '09:00'], ['09:00', '10:30'], ['10:30', '12:00'],
  ['12:30', '14:00'], ['14:00', '15:30'], ['15:30', '17:00'],
  ['17:30', '19:00'], ['19:00', '20:30'],
]

function devFakeEntries(roomName: string, building: Building, day: DayCode): ScheduleEntry[] {
  const num = parseInt(roomName.split(' ')[1], 10)
  const count = 5 + (num % 2)
  const offset = num % (ALL_SLOTS.length - count)
  const slots = ALL_SLOTS.slice(offset, offset + count)

  return slots.map(([startTime, endTime], i) => {
    const seed = num * 31 + i * 7
    const instructor = FAKE_INSTRUCTORS[seed % FAKE_INSTRUCTORS.length]
    const subject = FAKE_SUBJECTS[(seed * 3) % FAKE_SUBJECTS.length]
    return {
      id: `dev-${roomName}-${day}-${i}`,
      subject,
      title: `${subject} Lecture`,
      section: `${building}-${(seed % 5) + 1}`,
      days: [day],
      startTime,
      endTime,
      room: roomName,
      building,
      instructor,
    }
  })
}

function buildRoomsForDay(building: Building, day: DayCode): FloorData[] {
  return FLOOR_DEFS.map(({ label, min, max }) => ({
    label,
    rooms: Array.from({ length: max - min + 1 }, (_, i) => {
      const num = min + i
      const roomName = `${building} ${num}`
      const realClasses = getClassesForRoom(roomName, day)
      const fakeClasses = devFakeEntries(roomName, building, day).filter(
        fake => !realClasses.some(
          real => fake.startTime < real.endTime && real.startTime < fake.endTime
        )
      )
      const classes = [...realClasses, ...fakeClasses].sort(
        (a, b) => a.startTime.localeCompare(b.startTime)
      )
      return {
        roomNumber: num,
        roomName,
        hasClasses: realClasses.some(c => c.instructor === MY_INSTRUCTOR),
        classes,
      }
    }),
  }))
}

export default async function BuildingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const building = (VALID_BUILDINGS.includes(id as Building) ? id : 'CB') as Building
  const now = new Date()
  const today = getDayCode(now)
  const todayLabel = today ? (ALL_DAYS.find(d => d.code === today)?.label ?? null) : null
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const defaultFilter: FilterPill = (() => {
    if (!today) return 'all'
    const earliest = schedule
      .filter(
        e =>
          e.building === building &&
          e.days.includes(today) &&
          e.instructor === MY_INSTRUCTOR
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
    if (!earliest) return 'all'
    const roomNum = parseInt(earliest.room.split(' ')[1], 10)
    const idx = FLOOR_DEFS.findIndex(f => roomNum >= f.min && roomNum <= f.max)
    return idx !== -1 ? idx : 'all'
  })()

  const allDaysFloors = Object.fromEntries(
    ALL_DAYS.map(({ code }) => [code, buildRoomsForDay(building, code)])
  ) as Record<DayCode, FloorData[]>

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-24">
        <div className="mb-5 sm:mb-7">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-gray-500 mb-4 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Buildings
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{building}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {todayLabel ? `Today — ${todayLabel}` : 'Weekend — no classes scheduled'}
          </p>
        </div>

        <BuildingRooms
          allDaysFloors={allDaysFloors}
          building={building}
          todayLabel={todayLabel}
          todayCode={today}
          defaultFilter={defaultFilter}
          currentTime={currentTime}
        />
      </div>
    </main>
  )
}
