'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ALL_DAYS, DayCode, getDayCode, getClassesForDay } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'

export default function SchedulePage() {
  const todayCode = getDayCode(new Date())
  const [selectedDay, setSelectedDay] = useState<DayCode>(todayCode ?? 'M')

  const classes = getClassesForDay(selectedDay)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-sm text-gray-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Buildings
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">BSIT 3-IT32</p>
        </div>

        {/* Day picker */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {ALL_DAYS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setSelectedDay(code)}
              className={[
                'flex-1 py-2 text-sm rounded-lg transition-colors',
                selectedDay === code
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'text-gray-500',
                todayCode === code && selectedDay !== code
                  ? 'font-semibold text-blue-600'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
              {todayCode === code && (
                <span className="block w-1 h-1 rounded-full bg-blue-500 mx-auto mt-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Class list */}
        {classes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No classes scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.map(cls => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{cls.subject}</p>
                    <p className="text-sm text-gray-500 mt-0.5 leading-snug">{cls.title}</p>
                  </div>
                  <span className="shrink-0 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {cls.room}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                  </span>
                  <span>·</span>
                  <span>{cls.section}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
