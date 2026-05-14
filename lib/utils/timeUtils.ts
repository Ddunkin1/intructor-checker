/**
 * Check if two time ranges overlap
 */
export function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(`1970-01-01T${start1}`)
  const e1 = new Date(`1970-01-01T${end1}`)
  const s2 = new Date(`1970-01-01T${start2}`)
  const e2 = new Date(`1970-01-01T${end2}`)

  return s1 < e2 && s2 < e1
}

/**
 * Format time for display (e.g., "08:00" -> "8:00 AM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export type ClassStatus = 'past' | 'ongoing' | 'upcoming'

export function getClassStatus(startTime: string, endTime: string, now: Date): ClassStatus {
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMins = sh * 60 + sm
  const endMins = eh * 60 + em
  if (nowMins >= endMins) return 'past'
  if (nowMins >= startMins) return 'ongoing'
  return 'upcoming'
}

/**
 * Get the start of week for a given date (Monday)
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Generate time slots for a day (e.g., 8:00, 9:00, ..., 18:00)
 */
export function generateTimeSlots(startHour = 8, endHour = 18): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  return slots
}