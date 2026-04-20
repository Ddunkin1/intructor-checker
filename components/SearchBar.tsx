'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { ScheduleEntry } from '@/lib/data/scheduleData'

interface Props {
  schedule: ScheduleEntry[]
  children: React.ReactNode
}

export function SearchBar({ schedule, children }: Props) {
  const [query, setQuery] = useState('')

  const trimmed = query.trim().toLowerCase()

  const results = trimmed
    ? schedule.filter(
        e =>
          e.instructor.toLowerCase().includes(trimmed) ||
          e.room.toLowerCase().includes(trimmed)
      )
    : []

  return (
    <>
      {/* Search input */}
      <div className="relative mb-5 sm:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search professor or room…"
          className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
          suppressHydrationWarning
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results or building cards */}
      {trimmed ? (
        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <p className="text-sm font-semibold text-gray-400">No results found</p>
              <p className="text-xs text-gray-300 mt-1">Try a different name or room number</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map(entry => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl px-4 py-3.5 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {entry.instructor}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {entry.subject} — {entry.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {entry.room}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                    <span>{entry.days.join('/')}</span>
                    <span>·</span>
                    <span>{entry.startTime}–{entry.endTime}</span>
                    <span>·</span>
                    <span>{entry.section}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </>
  )
}
