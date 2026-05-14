'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Modal'
import { DayCode, ScheduleEntry, ALL_DAYS } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'

const FLOOR_PILL_LABELS = ['GF', '2F', '3F', '4F']

export type FilterPill = 'all' | 'active' | number

export interface RoomData {
  roomNumber: number
  roomName: string
  hasClasses: boolean
  classes: ScheduleEntry[]
}

export interface FloorData {
  label: string
  rooms: RoomData[]
}

interface Props {
  allDaysFloors: Record<DayCode, FloorData[]>
  building: string
  myInstructor: string
  todayLabel: string | null
  todayCode: DayCode | null
  defaultFilter: FilterPill
  currentTime: string
}

// MY class status always takes priority over general room occupancy.
// Other instructors' sessions only affect rooms that aren't mine.
type RoomStatus =
  | 'my-in-session'  // my class is happening right now
  | 'my-upcoming'    // my class starts within 30 min
  | 'my-later'       // my class is later today (>30 min away)
  | 'my-done'        // I had a class here today but it already ended
  | 'occupied'       // someone else's class is in session (not my room)
  | 'has-class'      // other instructor has a class here today (not mine)
  | 'free'

function getRoomStatus(
  classes: ScheduleEntry[],
  currentTime: string,
  isToday: boolean,
  myInstructor: string
): RoomStatus {
  if (classes.length === 0) return 'free'

  const myClasses = classes.filter(c => c.instructor === myInstructor)

  if (!isToday) {
    return myClasses.length > 0 ? 'my-later' : 'has-class'
  }

  const [nowH, nowM] = currentTime.split(':').map(Number)
  const nowMins = nowH * 60 + nowM

  // Check MY classes first — they always win
  for (const cls of myClasses) {
    if (currentTime >= cls.startTime && currentTime < cls.endTime) return 'my-in-session'
  }
  for (const cls of myClasses) {
    const [ch, cm] = cls.startTime.split(':').map(Number)
    const diff = ch * 60 + cm - nowMins
    if (diff > 0 && diff <= 30) return 'my-upcoming'
  }
  if (myClasses.some(cls => {
    const [ch, cm] = cls.startTime.split(':').map(Number)
    return ch * 60 + cm > nowMins
  })) return 'my-later'
  if (myClasses.length > 0) return 'my-done'

  // No my classes in this room — check other instructors
  for (const cls of classes) {
    if (currentTime >= cls.startTime && currentTime < cls.endTime) return 'occupied'
  }
  return 'has-class'
}

type TimelineItem =
  | { type: 'class'; entry: ScheduleEntry }
  | { type: 'free'; from: string; to: string }

function buildTimeline(classes: ScheduleEntry[]): TimelineItem[] {
  const items: TimelineItem[] = []
  for (let i = 0; i < classes.length; i++) {
    if (i > 0 && classes[i].startTime > classes[i - 1].endTime) {
      items.push({ type: 'free', from: classes[i - 1].endTime, to: classes[i].startTime })
    }
    items.push({ type: 'class', entry: classes[i] })
  }
  return items
}

export function BuildingRooms({
  allDaysFloors,
  myInstructor,
  todayCode,
  defaultFilter,
  currentTime,
}: Props) {
  const [filter, setFilter] = useState<FilterPill>(defaultFilter)
  const [selectedDay, setSelectedDay] = useState<DayCode>(todayCode ?? 'M')
  const [selected, setSelected] = useState<RoomData | null>(null)

  const floors = allDaysFloors[selectedDay] ?? []
  const isToday = selectedDay === todayCode
  const dayLabel = ALL_DAYS.find(d => d.code === selectedDay)?.label ?? selectedDay
  const timeline = selected ? buildTimeline(selected.classes) : []

  const nowMins = (() => {
    const [h, m] = currentTime.split(':').map(Number)
    return h * 60 + m
  })()

  const visibleFloors = (() => {
    if (filter === 'all') return floors
    if (filter === 'active') {
      return floors
        .map(f => ({ ...f, rooms: f.rooms.filter(r => r.hasClasses) }))
        .filter(f => f.rooms.length > 0)
    }
    const floor = floors[filter as number]
    return floor ? [floor] : []
  })()

  const activeRoomCount = floors.reduce(
    (sum, f) => sum + f.rooms.filter(r => r.hasClasses).length,
    0
  )

  function handleDayChange(day: DayCode) {
    setSelectedDay(day)
    setSelected(null)
  }

  function getPopupStatus(classes: ScheduleEntry[]) {
    if (!isToday) return null
    if (classes.length === 0) return { dot: 'bg-gray-300', text: 'Free all day' }
    const [nowH, nowM] = currentTime.split(':').map(Number)
    const nowMin = nowH * 60 + nowM
    for (const cls of classes) {
      if (currentTime >= cls.startTime && currentTime < cls.endTime) {
        const isOwn = cls.instructor === myInstructor
        return {
          dot: 'bg-green-500 animate-pulse',
          text: isOwn
            ? `Your class in session · ends ${formatTime(cls.endTime)}`
            : `Occupied now · ends ${formatTime(cls.endTime)}`,
        }
      }
    }
    // "Starting soon" — only for MY instructor's class
    for (const cls of classes) {
      if (cls.instructor !== myInstructor) continue
      const [ch, cm] = cls.startTime.split(':').map(Number)
      const diff = ch * 60 + cm - nowMin
      if (diff > 0 && diff <= 30) {
        return { dot: 'bg-amber-400', text: `Your class starts at ${formatTime(cls.startTime)}` }
      }
    }
    const next = classes.find(cls => {
      const [ch, cm] = cls.startTime.split(':').map(Number)
      return ch * 60 + cm > nowMin
    })
    if (next) return { dot: 'bg-gray-300', text: `Free now · next class at ${formatTime(next.startTime)}` }
    return { dot: 'bg-gray-300', text: 'No more classes today' }
  }

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-gray-100 pt-1 pb-4 space-y-3">

        {/* Day switcher */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {ALL_DAYS.map(({ code, label }) => {
            const isSelected = code === selectedDay
            const isCurrentDay = code === todayCode
            return (
              <button
                key={code}
                onClick={() => handleDayChange(code)}
                className={[
                  'shrink-0 flex flex-col items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150',
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200',
                ].join(' ')}
              >
                {label}
                <span className={[
                  'w-1 h-1 rounded-full mt-0.5',
                  isCurrentDay
                    ? isSelected ? 'bg-green-400' : 'bg-green-500'
                    : 'opacity-0',
                ].join(' ')} />
              </button>
            )
          })}
        </div>

        {/* Floor filter — Mine pill + segmented control */}
        <div className="flex items-center gap-2">
          {activeRoomCount > 0 && (
            <button
              onClick={() => setFilter('active')}
              className={[
                'shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors duration-150 shadow-sm',
                filter === 'active' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700',
              ].join(' ')}
            >
              <span className={[
                'w-1.5 h-1.5 rounded-full shrink-0',
                filter === 'active' ? 'bg-white' : 'bg-orange-400',
              ].join(' ')} />
              Mine
            </button>
          )}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-1 flex gap-0.5">
            <button
              onClick={() => setFilter('all')}
              className={[
                'flex-1 text-xs font-bold py-2 rounded-xl transition-colors duration-150',
                filter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600',
              ].join(' ')}
            >
              All
            </button>
            {FLOOR_PILL_LABELS.map((label, idx) => (
              <button
                key={label}
                onClick={() => setFilter(idx)}
                className={[
                  'flex-1 text-xs font-bold py-2 rounded-xl transition-colors duration-150',
                  filter === idx ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap pb-1">
        {isToday ? (
          <>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />My class now</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Starting soon</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" />My class</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-green-400" />In session</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" />Has classes</span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-orange-400" />My class</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" />Has classes</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200" />Free</span>
          </>
        )}
      </div>

      {/* Room grid */}
      <div className="space-y-8">
        {visibleFloors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
            <p className="text-sm font-semibold text-gray-400">No rooms match this filter</p>
            <p className="text-xs text-gray-300 mt-1">Try a different floor or day</p>
          </div>
        ) : (
          visibleFloors.map(floor => (
            <div key={floor.label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {floor.label}
              </p>
              <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
                {floor.rooms.map(room => {
                  const status = getRoomStatus(room.classes, currentTime, isToday, myInstructor)

                  const tileStyle = (() => {
                    if (status === 'my-in-session') return 'bg-green-50 border-green-300 text-green-900 shadow-md ring-1 ring-green-200'
                    if (status === 'my-upcoming') return 'bg-amber-50 border-amber-200 text-amber-900 shadow-sm'
                    if (status === 'my-later') return 'bg-orange-50 border-orange-200 text-orange-900 shadow-sm'
                    if (status === 'my-done') return 'bg-white border-orange-100 text-gray-400'
                    if (status === 'occupied') return 'bg-green-50 border-green-200 text-green-800'
                    if (status === 'has-class') return 'bg-white border-gray-300 text-gray-600'
                    return 'bg-white border-gray-100 text-gray-300'
                  })()

                  const dotStyle = (() => {
                    if (status === 'my-in-session') return 'bg-green-500 animate-pulse'
                    if (status === 'my-upcoming') return 'bg-amber-400'
                    if (status === 'my-later') return 'bg-orange-400'
                    if (status === 'my-done') return 'bg-orange-200'
                    if (status === 'occupied') return 'bg-green-400'
                    if (status === 'has-class') return 'bg-gray-300'
                    return 'hidden'
                  })()

                  return (
                    <button
                      key={room.roomNumber}
                      id={`room-${room.roomName.replace(' ', '-')}`}
                      onClick={() => setSelected(room)}
                      className={[
                        'relative flex flex-col items-center justify-center aspect-square rounded-2xl border',
                        'text-sm font-bold transition-all duration-150 active:scale-90',
                        tileStyle,
                      ].join(' ')}
                    >
                      <span className={['absolute top-1.5 right-1.5 w-2 h-2 rounded-full', dotStyle].join(' ')} />
                      {room.roomNumber}
                      {hasAny && (
                        <span className={[
                          'text-[9px] font-semibold mt-0.5 opacity-60',
                        ].join(' ')}>
                          {room.classes.length} {room.classes.length === 1 ? 'class' : 'classes'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Room detail modal */}
      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null) }}>
        <DialogContent className="bg-white p-0 gap-0 overflow-hidden rounded-3xl w-[calc(100%-2.5rem)] max-w-sm shadow-2xl border-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight pr-8">
              {selected?.roomName}
            </DialogTitle>

            {/* Date + my class badge */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <p className="text-xs text-gray-400 font-medium">
                {isToday ? `Today — ${dayLabel}` : dayLabel}
              </p>
              {selected?.hasClasses && (() => {
                const s = getRoomStatus(selected.classes, currentTime, isToday, myInstructor)
                const done = s === 'my-done'
                return (
                  <>
                    <span className="text-gray-200">·</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${done ? 'text-gray-400' : 'text-orange-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-gray-400' : 'bg-orange-400'}`} />
                      {done ? 'My class (done)' : 'My class today'}
                    </span>
                  </>
                )
              })()}
            </div>

            {/* Right-now status line */}
            {selected && (() => {
              const s = getPopupStatus(selected.classes)
              if (!s) return null
              return (
                <div className="flex items-center gap-1.5 mt-2 bg-gray-50 rounded-xl px-3 py-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <p className="text-xs font-semibold text-gray-600">{s.text}</p>
                </div>
              )
            })()}
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] px-4 pt-4 pb-6 space-y-2">
            {selected && selected.classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-10 h-10 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <p className="text-sm font-semibold text-gray-400">No classes scheduled</p>
                <p className="text-xs text-gray-300 mt-1">Room is free today</p>
              </div>
            ) : (
              timeline.map((item, i) => {
                if (item.type === 'free') {
                  return (
                    <div key={`free-${i}`} className="flex items-center gap-3 px-3 py-2 rounded-xl">
                      <div className="w-px self-stretch bg-gray-200 shrink-0 mx-[1px]" />
                      <p className="text-xs text-gray-300 font-medium">
                        {formatTime(item.from)} – {formatTime(item.to)} · Free
                      </p>
                    </div>
                  )
                }

                const isOwn = item.entry.instructor === myInstructor
                const isNow = isToday &&
                  currentTime >= item.entry.startTime &&
                  currentTime < item.entry.endTime

                return (
                  <div
                    key={item.entry.id}
                    className={[
                      'flex items-start gap-3 px-3.5 py-3.5 rounded-2xl',
                      isOwn
                        ? 'bg-orange-50 ring-1 ring-orange-100'
                        : isNow
                        ? 'bg-gray-100 ring-1 ring-gray-200'
                        : 'bg-gray-50 ring-1 ring-gray-100',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'w-[3px] self-stretch rounded-full shrink-0',
                        isOwn ? 'bg-orange-400' : isNow ? 'bg-gray-500' : 'bg-gray-300',
                      ].join(' ')}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={[
                          'text-sm font-bold truncate',
                          isOwn ? 'text-orange-900' : 'text-gray-900',
                        ].join(' ')}>
                          {item.entry.subject}
                        </p>
                        {isNow && (
                          <span className="shrink-0 text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full leading-none">
                            NOW
                          </span>
                        )}
                      </div>
                      <p className={[
                        'text-xs font-medium mt-0.5',
                        isOwn ? 'text-orange-600' : 'text-gray-500',
                      ].join(' ')}>
                        {formatTime(item.entry.startTime)} – {formatTime(item.entry.endTime)}
                      </p>
                      <p className={[
                        'text-xs mt-0.5',
                        isOwn ? 'text-orange-400' : 'text-gray-400',
                      ].join(' ')}>
                        {item.entry.section} ·{' '}
                        <Link
                          href={`/instructor/${encodeURIComponent(item.entry.instructor)}`}
                          onClick={() => setSelected(null)}
                          className="underline decoration-dotted underline-offset-2"
                        >
                          {item.entry.instructor}
                        </Link>
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
