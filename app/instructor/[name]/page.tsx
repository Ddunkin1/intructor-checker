import { ALL_DAYS, DayCode, schedule, ScheduleEntry } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'
import { BackButton } from '@/components/BackButton'

const DAY_LABELS: Record<DayCode, string> = {
  M: 'Monday', T: 'Tuesday', W: 'Wednesday', TH: 'Thursday', F: 'Friday',
}

const BUILDING_LABELS: Record<string, string> = {
  CB: 'CB Building', CBS: 'CBS Building', CBE: 'CBE Building',
}

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const instructorName = decodeURIComponent(name)

  const myClasses = schedule.filter(e => e.instructor === instructorName)

  const byDay = Object.fromEntries(
    ALL_DAYS.map(({ code }) => [
      code,
      myClasses
        .filter(e => e.days.includes(code))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    ])
  ) as Record<DayCode, ScheduleEntry[]>

  const weeklyMeetings = myClasses.reduce((sum, e) => sum + e.days.length, 0)
  const buildings = [...new Set(myClasses.map(e => e.building))]
  const buildingStr = buildings.map(b => BUILDING_LABELS[b] ?? b).join(', ')
  const activeDays = ALL_DAYS.filter(({ code }) => byDay[code].length > 0)

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-24">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <BackButton />
          <div className="mt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Instructor
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {instructorName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {myClasses.length === 0
                ? 'No classes scheduled'
                : `${weeklyMeetings} class${weeklyMeetings !== 1 ? 'es' : ''} this week · ${buildingStr}`}
            </p>
          </div>
        </div>

        {/* No classes */}
        {myClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            <p className="text-sm font-semibold text-gray-400">No classes this semester</p>
            <p className="text-xs text-gray-300 mt-1">Nothing scheduled for this instructor</p>
          </div>
        ) : (
          <div className="space-y-7">
            {activeDays.map(({ code, label: _ }) => (
              <div key={code}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  {DAY_LABELS[code]}
                </p>
                <div className="space-y-2">
                  {byDay[code].map(entry => (
                    <div
                      key={`${entry.id}-${code}`}
                      className="bg-white rounded-2xl shadow-sm px-4 py-4 border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900">{entry.subject}</p>
                          {entry.title && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.title}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                          {entry.room}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-2 text-xs text-gray-400">
                        <span className="tabular-nums font-medium">
                          {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                        </span>
                        <span>·</span>
                        <span>{entry.section}</span>
                        <span>·</span>
                        <span>{BUILDING_LABELS[entry.building] ?? entry.building}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
