import { Suspense } from 'react'
import { BookingModal } from '@/components/BookingModal'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/schedule">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schedule
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book a Room</h1>
          <p className="mt-2 text-gray-600">Select a room, date, and time to create a booking</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Suspense fallback={<div className="text-center py-12">Loading booking form...</div>}>
            <BookingModal />
          </Suspense>
        </div>
      </div>
    </div>
  )
}