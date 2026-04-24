'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, User, MapPin, BookOpen, ChevronRight } from 'lucide-react'
import { DayCode, ScheduleEntry } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'

interface Props {
  todayCode: DayCode | null
  schedule: ScheduleEntry[]
  instructors: string[]
}

function getFloorLabel(room: string): string {
  const num = parseInt(room.split(' ')[1], 10)
  if (num >= 400) return '4th Floor'
  if (num >= 300) return '3rd Floor'
  if (num >= 200) return '2nd Floor'
  return 'Ground Floor'
}

function todayText(count: number): string {
  if (count === 0) return 'No classes today'
  return `${count} class${count > 1 ? 'es' : ''} today`
}

const SECTION_HEADER = 'text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3'
const CARD = 'flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform'
const ICON_WRAP = 'w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0'

export function SearchView({ todayCode, schedule, instructors }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const trimmed = query.trim().toLowerCase()

  // ── Instructor results ──────────────────────────────────────────────────────
  const allInstructorData = instructors.map(name => {
    const classes = schedule.filter(e => e.instructor === name)
    const todayCount = todayCode ? classes.filter(e => e.days.includes(todayCode)).length : 0
    const buildings = [...new Set(classes.map(e => e.building))]
    return { name, todayCount, buildings }
  })

  const instructorResults = trimmed
    ? allInstructorData.filter(r => r.name.toLowerCase().includes(trimmed))
    : []

  // ── Room results ────────────────────────────────────────────────────────────
  const allRooms = [...new Set(schedule.map(e => e.room))].sort()
  const roomResults = trimmed
    ? allRooms
        .filter(room => room.toLowerCase().includes(trimmed))
        .map(room => {
          const classes = schedule.filter(e => e.room === room)
          const todayCount = todayCode ? classes.filter(e => e.days.includes(todayCode)).length : 0
          const building = classes[0]?.building ?? ''
          return { room, building, todayCount, floor: getFloorLabel(room) }
        })
    : []

  // ── Subject results ─────────────────────────────────────────────────────────
  const subjectResults: ScheduleEntry[] = trimmed
    ? schedule.filter(e =>
        e.subject.toLowerCase().includes(trimmed) ||
        e.title.toLowerCase().includes(trimmed)
      )
    : []

  const hasResults =
    instructorResults.length > 0 ||
    roomResults.length > 0 ||
    subjectResults.length > 0

  return (
    <>
      {/* Sticky search input */}
      <div className="sticky top-0 z-10 bg-gray-100 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Instructor, subject, room…"
            className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
            suppressHydrationWarning
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Zero query — all instructors quick links */}
      {!trimmed && (
        <div>
          <p className="text-xs text-gray-400 text-center mb-5">Search for a professor, room, or subject</p>
          <p className={SECTION_HEADER}>All Instructors</p>
          <div className="space-y-2">
            {allInstructorData.map(({ name, todayCount, buildings }) => (
              <Link key={name} href={`/instructor/${encodeURIComponent(name)}`} className={CARD}>
                <div className={ICON_WRAP}>
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {todayText(todayCount)} · {buildings.join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Has query — grouped results */}
      {trimmed && (
        <div className="space-y-7">
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No results found</p>
              <p className="text-xs text-gray-300 mt-1">Try a name, room, or subject</p>
            </div>
          )}

          {instructorResults.length > 0 && (
            <div>
              <p className={SECTION_HEADER}>Instructors</p>
              <div className="space-y-2">
                {instructorResults.map(({ name, todayCount, buildings }) => (
                  <Link key={name} href={`/instructor/${encodeURIComponent(name)}`} className={CARD}>
                    <div className={ICON_WRAP}>
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {todayText(todayCount)} · {buildings.join(', ')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {roomResults.length > 0 && (
            <div>
              <p className={SECTION_HEADER}>Rooms</p>
              <div className="space-y-2">
                {roomResults.map(({ room, building, todayCount, floor }) => (
                  <Link key={room} href={`/building/${building}#room-${room.replace(' ', '-')}`} className={CARD}>
                    <div className={ICON_WRAP}>
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{room}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {todayText(todayCount)} · {floor}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {subjectResults.length > 0 && (
            <div>
              <p className={SECTION_HEADER}>Subjects</p>
              <div className="space-y-2">
                {subjectResults.map(entry => (
                  <Link
                    key={entry.id}
                    href={`/instructor/${encodeURIComponent(entry.instructor)}`}
                    className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 block active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${ICON_WRAP} mt-0.5`}>
                        <BookOpen className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900">{entry.subject}</p>
                          <p className="text-xs text-gray-400 truncate">{entry.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.instructor} · {entry.room} · {entry.days.join('/')}{' '}
                          {formatTime(entry.startTime)}–{formatTime(entry.endTime)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
