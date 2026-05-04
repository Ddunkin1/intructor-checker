import { redirect } from 'next/navigation'
import {
  ALL_DAYS,
  DayCode,
  ScheduleEntry,
  getDayCode,
} from '@/lib/data/scheduleData'
import { getScheduleEntries } from '@/lib/data/supabaseSchedule'
import { getUser } from '@/lib/auth/getUser'
import { MyScheduleView, ClassContext } from '@/components/MyScheduleView'

function getClassContext(
  entry: ScheduleEntry,
  dayCode: DayCode,
  allEntries: ScheduleEntry[]
): ClassContext {
  const roomClasses = allEntries
    .filter(e => e.room === entry.room && e.days.includes(dayCode))
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const before = roomClasses.find(
    c => c.id !== entry.id && c.endTime === entry.startTime
  ) ?? null
  const after = roomClasses.find(
    c => c.id !== entry.id && c.startTime === entry.endTime
  ) ?? null
  return { entry, before, after }
}

export default async function MySchedulePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const todayCode = getDayCode(now)
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const allEntries = await getScheduleEntries()

  const allDays = Object.fromEntries(
    ALL_DAYS.map(({ code }) => {
      const myClasses = allEntries
        .filter(e => e.instructor === user.fullName && e.days.includes(code))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
      return [code, myClasses.map(entry => getClassContext(entry, code, allEntries))]
    })
  ) as Record<DayCode, ClassContext[]>

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg lg:max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 pb-24 lg:pb-8">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Instructor
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            My Schedule
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user.fullName}</p>
        </div>

        <MyScheduleView
          allDays={allDays}
          todayCode={todayCode}
          currentTime={currentTime}
        />
      </div>
    </main>
  )
}
