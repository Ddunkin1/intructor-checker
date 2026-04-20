import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  Building,
  ALL_DAYS,
  getDayCode,
  getRoomsForBuilding,
  getClassesForRoom,
} from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'

export default async function BuildingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const building = id as Building
  const today = getDayCode(new Date())
  const rooms = getRoomsForBuilding(building)
  const todayLabel = today ? ALL_DAYS.find(d => d.code === today)?.label : null

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-gray-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Buildings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{building}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {todayLabel ? `Today — ${todayLabel}` : 'Weekend — no classes scheduled'}
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 text-sm">No schedule data yet for {building}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map(room => {
              const classes = today ? getClassesForRoom(room, today) : []
              const hasClasses = classes.length > 0

              return (
                <div
                  key={room}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-50">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${hasClasses ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="font-semibold text-gray-900">{room}</span>
                    {!hasClasses && (
                      <span className="ml-auto text-xs text-gray-400">Free today</span>
                    )}
                  </div>

                  {hasClasses && (
                    <div className="divide-y divide-gray-50">
                      {classes.map(cls => (
                        <div key={cls.id} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {cls.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{cls.title}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                              {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {cls.section} · {cls.instructor}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/schedule"
            className="flex items-center justify-center text-sm text-blue-600 font-medium py-3"
          >
            View full week schedule
          </Link>
        </div>
      </div>
    </main>
  )
}
