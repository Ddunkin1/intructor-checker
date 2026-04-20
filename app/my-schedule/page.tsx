import {
  ALL_DAYS,
  DayCode,
  MY_INSTRUCTOR,
  ScheduleEntry,
  getDayCode,
  getClassesForRoom,
  schedule,
} from '@/lib/data/scheduleData'
import { MyScheduleView, ClassContext } from '@/components/MyScheduleView'

function getClassContext(entry: ScheduleEntry, dayCode: DayCode): ClassContext {
  const roomClasses = getClassesForRoom(entry.room, dayCode)
  const before = roomClasses.find(
    c => c.id !== entry.id && c.endTime === entry.startTime
  ) ?? null
  const after = roomClasses.find(
    c => c.id !== entry.id && c.startTime === entry.endTime
  ) ?? null
  return { entry, before, after }
}

export default function MySchedulePage() {
  const now = new Date()
  const todayCode = getDayCode(now)
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const allDays = Object.fromEntries(
    ALL_DAYS.map(({ code }) => {
      const myClasses = schedule
        .filter(e => e.instructor === MY_INSTRUCTOR && e.days.includes(code))
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
      return [code, myClasses.map(entry => getClassContext(entry, code))]
    })
  ) as Record<DayCode, ClassContext[]>

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-24">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Instructor
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            My Schedule
          </h1>
          <p className="text-sm text-gray-500 mt-1">{MY_INSTRUCTOR}</p>
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
