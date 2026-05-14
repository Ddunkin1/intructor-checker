export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  Building,
  ALL_DAYS,
  DayCode,
  getDayCode,
  ScheduleEntry,
} from '@/lib/data/scheduleData'
import { getEntriesForBuilding } from '@/lib/data/supabaseSchedule'
import { getUser } from '@/lib/auth/getUser'
import { BuildingRooms, FloorData, FilterPill } from '@/components/BuildingRooms'

const FLOOR_DEFS = [
  { label: 'Ground Floor', min: 101, max: 125 },
  { label: '2nd Floor',    min: 201, max: 225 },
  { label: '3rd Floor',    min: 301, max: 325 },
  { label: '4th Floor',    min: 401, max: 425 },
]

const VALID_BUILDINGS: Building[] = ['CB', 'CBS', 'CBE']

function buildRoomsForDay(
  building: Building,
  day: DayCode,
  realEntries: ScheduleEntry[],
  myInstructor: string
): FloorData[] {
  return FLOOR_DEFS.map(({ label, min, max }) => ({
    label,
    rooms: Array.from({ length: max - min + 1 }, (_, i) => {
      const num = min + i
      const roomName = `${building} ${num}`
      const classes = realEntries
        .filter(e => e.room === roomName && e.days.includes(day))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
      return {
        roomNumber: num,
        roomName,
        hasClasses: classes.some(c => c.instructor === myInstructor),
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
  const [{ id }, user] = await Promise.all([params, getUser()])
  if (!user) redirect('/login')

  const building = (VALID_BUILDINGS.includes(id as Building) ? id : 'CB') as Building
  const now = new Date()
  const today = getDayCode(now)
  const todayLabel = today ? (ALL_DAYS.find(d => d.code === today)?.label ?? null) : null
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const realEntries = await getEntriesForBuilding(building)

  const defaultFilter: FilterPill = (() => {
    if (!today) return 'all'
    const earliest = realEntries
      .filter(e => e.days.includes(today) && e.instructor === user.fullName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
    if (!earliest) return 'all'
    const roomNum = parseInt(earliest.room.split(' ')[1], 10)
    const idx = FLOOR_DEFS.findIndex(f => roomNum >= f.min && roomNum <= f.max)
    return idx !== -1 ? idx : 'all'
  })()

  const allDaysFloors = Object.fromEntries(
    ALL_DAYS.map(({ code }) => [
      code,
      buildRoomsForDay(building, code, realEntries, user.fullName),
    ])
  ) as Record<DayCode, FloorData[]>

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg lg:max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 pb-24 lg:pb-8">
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
          myInstructor={user.fullName}
          todayLabel={todayLabel}
          todayCode={today}
          defaultFilter={defaultFilter}
          currentTime={currentTime}
        />
      </div>
    </main>
  )
}
