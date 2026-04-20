'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-sm text-gray-500 min-h-[44px]"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  )
}
