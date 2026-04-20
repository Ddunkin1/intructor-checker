'use client'

import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Conflict {
  booking1: {
    id: string
    class_name: string
    date: string
    start_time: string
    end_time: string
    rooms?: { name: string }
    instructors?: { full_name: string }
  }
  booking2: {
    id: string
    class_name: string
    date: string
    start_time: string
    end_time: string
    rooms?: { name: string }
    instructors?: { full_name: string }
  }
  reason: 'overlap' | 'double_booking'
}

interface ConflictAlertProps {
  conflicts: Conflict[]
  onDismiss?: () => void
}

export function ConflictAlert({ conflicts, onDismiss }: ConflictAlertProps) {
  if (conflicts.length === 0) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-yellow-800">
              Schedule Conflicts Detected ({conflicts.length})
            </h3>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mt-2 space-y-3">
            {conflicts.map((conflict, index) => (
              <div key={index} className="bg-white border border-yellow-300 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={conflict.reason === 'overlap' ? 'destructive' : 'secondary'}>
                    {conflict.reason === 'overlap' ? 'Room Overlap' : 'Double Booking'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(conflict.booking1.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <div className="text-sm font-medium text-red-900">
                      {conflict.booking1.class_name}
                    </div>
                    <div className="text-xs text-red-700 mt-1">
                      {conflict.booking1.rooms?.name} • {conflict.booking1.instructors?.full_name}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {conflict.booking1.start_time} - {conflict.booking1.end_time}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="text-sm font-medium text-blue-900">
                      {conflict.booking2.class_name}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      {conflict.booking2.rooms?.name} • {conflict.booking2.instructors?.full_name}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {conflict.booking2.start_time} - {conflict.booking2.end_time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-yellow-700">
            <p>
              <strong>Action required:</strong> Please resolve these conflicts by adjusting booking times
              or cancelling one of the conflicting bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}