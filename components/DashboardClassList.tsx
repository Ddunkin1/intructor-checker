'use client'

import { useEffect, useState } from 'react'
import { ScheduleEntry } from '@/lib/data/scheduleData'
import { formatTime, getClassStatus } from '@/lib/utils/timeUtils'

interface Props {
  classes: ScheduleEntry[]
}

export function DashboardClassList({ classes }: Props) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-3 sm:mx-5 mb-3 sm:mb-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 overflow-hidden">
      {classes.map(cls => {
        // Before client mounts, treat all as upcoming (no NOW/DONE flicker)
        const status = now ? getClassStatus(cls.startTime, cls.endTime, now) : 'upcoming'
        return (
          <div
            key={cls.id}
            className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 last:border-b-0 ${status === 'past' ? 'opacity-40' : ''}`}
          >
            {status === 'ongoing' ? (
              <span className="relative flex w-1.5 h-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-green-500" />
              </span>
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status === 'past' ? 'bg-gray-300' : 'bg-blue-400'}`} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-sm font-semibold truncate ${status === 'past' ? 'text-gray-500' : 'text-gray-800'}`}>
                  {cls.subject}
                </p>
                {status === 'ongoing' && (
                  <span className="shrink-0 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Now</span>
                )}
                {status === 'past' && (
                  <span className="shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Done</span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">
                {cls.room} · {formatTime(cls.startTime)}–{formatTime(cls.endTime)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
