import { ScheduleEntry } from '@/lib/data/scheduleData'
import { timesOverlap } from '@/lib/utils/timeUtils'

export interface ConflictPair {
  entry1: ScheduleEntry
  entry2: ScheduleEntry
}

export function findConflicts(entries: ScheduleEntry[]): ConflictPair[] {
  const conflicts: ConflictPair[] = []
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]
      if (a.room !== b.room) continue
      const sharesDay = a.days.some(d => b.days.includes(d))
      if (!sharesDay) continue
      if (timesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
        conflicts.push({ entry1: a, entry2: b })
      }
    }
  }
  return conflicts
}

export function sharedDays(a: ScheduleEntry, b: ScheduleEntry): string[] {
  return a.days.filter(d => b.days.includes(d))
}
