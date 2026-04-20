import Link from 'next/link'
import { ChevronRight, CalendarDays, BookOpen } from 'lucide-react'
import { BUILDINGS, getDayCode, getClassesForBuilding } from '@/lib/data/scheduleData'

export default function DashboardPage() {
  const today = getDayCode(new Date())
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg md:max-w-2xl mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Today</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Instructor Room<br />Checker
          </h1>
          <p className="text-sm text-gray-500 mt-2">{dateLabel}</p>
        </div>

        {/* Building Cards — single column on phones, 2-col on md+ */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
          {BUILDINGS.map(({ id, label }) => {
            const todayClasses = today ? getClassesForBuilding(id, today) : []
            const hasClasses = todayClasses.length > 0

            return (
              <Link key={id} href={`/building/${id}`} className="block">
                <div
                  className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border transition-all active:scale-[0.98] ${
                    hasClasses ? 'bg-white border-green-100' : 'bg-white border-gray-100'
                  }`}
                >
                  {/* Building identity */}
                  <div
                    className={`flex flex-col items-center justify-center pt-5 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6 ${
                      hasClasses ? '' : 'opacity-50'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full mb-2 sm:mb-3 ${
                        hasClasses ? 'bg-green-500 shadow-md shadow-green-200' : 'bg-gray-300'
                      }`}
                    />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
                      Building
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
                      {label}
                    </h2>
                    <span
                      className={`mt-3 sm:mt-4 text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full ${
                        hasClasses ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {hasClasses
                        ? `${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today`
                        : 'No classes today'}
                    </span>
                  </div>

                  {/* Class list or empty state */}
                  {hasClasses ? (
                    <div className="mx-3 sm:mx-5 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-50 ring-1 ring-gray-100 overflow-hidden">
                      {todayClasses.map(cls => (
                        <div
                          key={cls.id}
                          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {cls.subject}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {cls.room} · {cls.startTime}–{cls.endTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 mx-3 sm:mx-5 mb-3 sm:mb-4 py-3 rounded-xl sm:rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                      <BookOpen className="w-3.5 h-3.5 text-gray-300" />
                      <p className="text-xs text-gray-300">No scheduled classes</p>
                    </div>
                  )}

                  {/* Tap hint — min 44px touch target */}
                  <div className="flex items-center justify-center gap-1 min-h-[44px] pb-1 text-xs text-gray-300 font-medium">
                    <span>View rooms</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer link — min 44px touch target */}
        <div className="mt-6 sm:mt-8">
          <Link
            href="/schedule"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold min-h-[44px] rounded-2xl bg-blue-50 active:bg-blue-100 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            View full week schedule
          </Link>
        </div>
      </div>
    </main>
  )
}
