'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DayCode, ScheduleEntry, ALL_DAYS } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'
import { MapPin, ChevronUp, ChevronDown } from 'lucide-react'

export interface ClassContext {
  entry: ScheduleEntry
  before: ScheduleEntry | null
  after: ScheduleEntry | null
}

interface Props {
  allDays: Record<DayCode, ClassContext[]>
  todayCode: DayCode | null
  currentTime: string
}

const BUILDING_LABELS: Record<string, string> = {
  CB: 'CB Building',
  CBS: 'CBS Building',
  CBE: 'CBE Building',
}

export function MyScheduleView({ allDays, todayCode, currentTime }: Props) {
  const [selectedDay, setSelectedDay] = useState<DayCode>(todayCode ?? 'M')
  const classes = allDays[selectedDay] ?? []
  const isToday = selectedDay === todayCode

  return (
    <>
      {/* Day switcher */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mb-6">
        {ALL_DAYS.map(({ code, label }) => {
          const isSelected = code === selectedDay
          const isCurrentDay = code === todayCode
          return (
            <button
              key={code}
              onClick={() => setSelectedDay(code)}
              className={[
                'shrink-0 flex flex-col items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150',
                isSelected ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200',
              ].join(' ')}
            >
              {label}
              {isCurrentDay && (
                <span className={[
                  'w-1 h-1 rounded-full mt-0.5',
                  isSelected ? 'bg-orange-400' : 'bg-orange-500',
                ].join(' ')} />
              )}
            </button>
          )
        })}
      </div>

      {/* Empty state */}
      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          <p className="text-sm font-semibold text-gray-400">No classes today — enjoy your day 🎉</p>
          <p className="text-xs text-gray-300 mt-1">Switch days to see another day's schedule</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map(({ entry, before, after }) => {
            const isNow = isToday &&
              currentTime >= entry.startTime &&
              currentTime < entry.endTime

            return (
              <div
                key={entry.id}
                className={[
                  'bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow',
                  isNow ? 'ring-2 ring-orange-200 shadow-md' : '',
                ].join(' ')}
              >
                <div className="flex">
                  {/* Left accent bar */}
                  <div className={[
                    'w-1 shrink-0',
                    isNow ? 'bg-orange-500' : 'bg-orange-300',
                  ].join(' ')} />

                  <div className="flex-1 px-4 py-4">
                    {/* Happening now badge */}
                    {isNow && (
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                          Happening now
                        </span>
                      </div>
                    )}

                    {/* Time */}
                    <p className="text-xs font-semibold text-gray-400 mb-1 tabular-nums">
                      {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                    </p>

                    {/* Subject + section */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-xl font-black text-gray-900 leading-tight">{entry.subject}</p>
                      <p className="text-sm text-gray-400 font-medium">{entry.section}</p>
                    </div>

                    {entry.title && (
                      <p className="text-xs text-gray-400 mt-0.5">{entry.title}</p>
                    )}

                    {/* Room */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <p className="text-sm font-semibold text-gray-800">
                        {entry.room}
                        <span className="font-normal text-gray-400">
                          {' · '}{BUILDING_LABELS[entry.building] ?? entry.building}
                        </span>
                      </p>
                    </div>

                    {/* Before / After context */}
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <ChevronUp className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                        {before ? (
                          <p className="text-xs text-gray-400 leading-snug">
                            <Link
                              href={`/instructor/${encodeURIComponent(before.instructor)}`}
                              className="font-semibold text-gray-600 underline decoration-dotted underline-offset-2"
                            >
                              {before.instructor}
                            </Link>
                            {' · '}{before.subject}{' ends at '}{formatTime(before.endTime)}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Room free before your class</p>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronDown className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                        {after ? (
                          <p className="text-xs text-gray-400 leading-snug">
                            <Link
                              href={`/instructor/${encodeURIComponent(after.instructor)}`}
                              className="font-semibold text-gray-600 underline decoration-dotted underline-offset-2"
                            >
                              {after.instructor}
                            </Link>
                            {' · '}{after.subject}{' starts at '}{formatTime(after.startTime)}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Room free after your class</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
