'use client'

import { useState } from 'react'
import { useSchedule } from '@/lib/hooks/useSchedule'
import { useRooms } from '@/lib/hooks/useRooms'
import { Button } from '@/components/ui/Button'
import { Clock, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { formatTime } from '@/lib/utils/timeUtils'

export function RoomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { data: scheduleData, isLoading: scheduleLoading, error: scheduleError } = useSchedule(currentDate)
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useRooms()

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())

  if (roomsLoading || scheduleLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (roomsError || scheduleError) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          Error loading schedule: {roomsError?.message || scheduleError?.message}
        </div>
      </div>
    )
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const getBookingsForRoomAndTime = (roomId: string, time: string, dayIndex: number) => {
    if (!scheduleData?.groupedByRoom[roomId]) return null

    const dayDate = new Date(scheduleData.weekStart)
    dayDate.setDate(scheduleData.weekStart.getDate() + dayIndex)

    return scheduleData.groupedByRoom[roomId].find((booking) => {
      const bookingDate = new Date(booking.date)
      return (
        bookingDate.toDateString() === dayDate.toDateString() &&
        booking.start_time <= time &&
        booking.end_time > time
      )
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Week of {scheduleData?.weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
            <p className="mt-1 text-sm text-gray-600">View the week at a glance by room and time</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Prev</span>
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <span className="mr-2">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {rooms?.map((room) => (
          <div key={room.id} className="rounded-3xl border border-gray-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Room</p>
                <p className="text-lg font-semibold text-gray-900">{room.name}</p>
                {room.building && <p className="text-xs text-gray-500">{room.building}</p>}
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {scheduleData?.weekStart?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(scheduleData?.weekEnd || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {weekDays.map((day, dayIndex) => {
                const dayDate = new Date(scheduleData?.weekStart || new Date())
                dayDate.setDate((scheduleData?.weekStart || new Date()).getDate() + dayIndex)

                const bookingsForDay = scheduleData?.schedule.filter((booking) => {
                  const bookingDate = new Date(booking.date)
                  return booking.room_id === room.id && bookingDate.toDateString() === dayDate.toDateString()
                }) || []

                return (
                  <div key={day} className="rounded-2xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-800">
                      <span>{day}</span>
                      <span className="text-xs text-slate-500">{dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {bookingsForDay.length > 0 ? (
                        bookingsForDay.map((booking) => (
                          <div key={booking.id} className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                            <p className="text-sm font-semibold text-blue-900 truncate">{booking.class_name}</p>
                            <p className="text-xs text-blue-700">{booking.start_time} – {booking.end_time}</p>
                            <p className="text-xs text-slate-600 truncate">{booking.instructors?.full_name || 'Unknown Instructor'}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No scheduled classes</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full">
          <div className="grid border-b border-gray-200 bg-gray-50" style={{ gridTemplateColumns: `200px repeat(${rooms?.length || 0}, minmax(0, 1fr))` }}>
            <div className="p-4 font-medium text-gray-900">Time / Room</div>
            {rooms?.map((room) => (
              <div key={room.id} className="border-l border-gray-200">
                <div className="p-2 text-center font-medium text-gray-900 border-b border-gray-200">
                  <div className="font-semibold">{room.name}</div>
                  {room.building && (
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {room.building}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-7">
                  {weekDays.map((day, index) => {
                    const dayDate = new Date(scheduleData?.weekStart || new Date())
                    dayDate.setDate((scheduleData?.weekStart || new Date()).getDate() + index)
                    const isToday = dayDate.toDateString() === new Date().toDateString()

                    return (
                      <div key={day} className={`p-2 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-blue-50 text-blue-900' : 'text-gray-700'}`}>
                        {day}
                        <br />
                        <span className="text-xs font-normal">
                          {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {timeSlots.map((time) => (
            <div key={time} className="grid border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${rooms?.length || 0}, minmax(0, 1fr))` }}>
              <div className="p-4 text-sm text-gray-600 flex items-center border-r border-gray-200 bg-gray-50">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(time)}
              </div>
              {rooms?.map((room) => (
                <div key={room.id} className="border-r border-gray-100">
                  <div className="grid grid-cols-7">
                    {weekDays.map((_, dayIndex) => {
                      const booking = getBookingsForRoomAndTime(room.id, time, dayIndex)
                      const dayDate = new Date(scheduleData?.weekStart || new Date())
                      dayDate.setDate((scheduleData?.weekStart || new Date()).getDate() + dayIndex)
                      const isToday = dayDate.toDateString() === new Date().toDateString()

                      return (
                        <div key={dayIndex} className={`p-1 min-h-[60px] border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                          {booking ? (
                            <div className="w-full h-full bg-blue-100 border border-blue-200 rounded p-1 text-xs">
                              <div className="font-medium text-blue-900 truncate">{booking.class_name}</div>
                              <div className="text-blue-700 truncate">{booking.instructors?.full_name}</div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
