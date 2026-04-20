'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRooms } from '@/lib/hooks/useRooms'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { generateTimeSlots } from '@/lib/utils/timeUtils'

export function BookingModal() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: rooms, isLoading: roomsLoading } = useRooms()

  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    className: ''
  })

  const [availability, setAvailability] = useState<{
    available: boolean
    conflicts: any[]
  } | null>(null)

  const [showSuccess, setShowSuccess] = useState(false)

  // Check availability when form data changes
  useEffect(() => {
    if (formData.roomId && formData.date && formData.startTime && formData.endTime) {
      checkAvailability()
    }
  }, [formData.roomId, formData.date, formData.startTime, formData.endTime])

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'checkAvailability',
          params: {
            roomId: formData.roomId,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        setAvailability(result.data)
      }
    } catch (error) {
      console.error('Error checking availability:', error)
    }
  }

  const bookRoomMutation = useMutation({
    mutationFn: async (bookingData: typeof formData) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/schedule')
      }, 2000)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (availability?.available) {
      bookRoomMutation.mutate(formData)
    }
  }

  const timeSlots = generateTimeSlots(8, 18)

  if (roomsLoading) {
    return <div className="text-center py-12">Loading rooms...</div>
  }

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">Your room has been successfully booked. Redirecting to schedule...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Room
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rooms?.map((room) => (
            <div
              key={room.id}
              onClick={() => setFormData(prev => ({ ...prev, roomId: room.id }))}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.roomId === room.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{room.name}</h3>
                  {room.building && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {room.building}
                    </p>
                  )}
                </div>
                {room.capacity && (
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {room.capacity}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Start Time
          </label>
          <select
            required
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select start time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <select
            required
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select end time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Class Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. CS101 - Intro to Programming"
          value={formData.className}
          onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Availability Status */}
      {availability && (
        <div className={`p-4 rounded-lg ${
          availability.available
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {availability.available ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${
              availability.available ? 'text-green-800' : 'text-red-800'
            }`}>
              {availability.available ? 'Room is available!' : 'Room is not available'}
            </span>
          </div>
          {!availability.available && availability.conflicts.length > 0 && (
            <div className="mt-2 text-sm text-red-700">
              Conflicts with: {availability.conflicts.map(c => c.class_name).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!availability?.available || bookRoomMutation.isPending}
          className="px-6"
        >
          {bookRoomMutation.isPending ? 'Booking...' : 'Book Room'}
        </Button>
      </div>

      {bookRoomMutation.error && (
        <div className="text-red-600 text-sm text-center">
          Error: {bookRoomMutation.error.message}
        </div>
      )}
    </form>
  )
}