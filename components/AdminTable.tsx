'use client'

import { useState } from 'react'
import { useBookings } from '@/lib/hooks/useBookings'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Modal'
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { formatTime } from '@/lib/utils/timeUtils'

export function AdminTable() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    roomId: '',
    instructorId: '',
    date: '',
    search: ''
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const { data: bookings, isLoading, error } = useBookings(filters)

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      setShowDeleteConfirm(null)
    }
  })

  const handleDelete = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          Error loading bookings: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by class name or instructor..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setFilters({ roomId: '', instructorId: '', date: '', search: '' })}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.class_name}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.rooms?.name}
                    </div>
                    {booking.rooms?.building && (
                      <div className="text-sm text-gray-500 ml-2 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.rooms.building}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {booking.instructors?.full_name}
                    </div>
                    {booking.instructors?.department && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {booking.instructors.department}
                      </Badge>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(booking.id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings?.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(v => v) ? 'Try adjusting your filters.' : 'No bookings have been created yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Confirm Cancellation
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
                disabled={deleteBookingMutation.isPending}
              >
                {deleteBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
            {deleteBookingMutation.error && (
              <div className="text-red-600 text-sm mt-4">
                Error: {deleteBookingMutation.error.message}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}