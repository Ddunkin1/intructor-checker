import { redirect } from 'next/navigation'
import { getDayCode } from '@/lib/data/scheduleData'
import { getUser } from '@/lib/auth/getUser'
import { getScheduleEntries, getInstructors } from '@/lib/data/supabaseSchedule'
import { SearchView } from '@/components/SearchView'

export default async function SearchPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const [schedule, instructors, todayCode] = await Promise.all([
    getScheduleEntries(),
    getInstructors(),
    Promise.resolve(getDayCode(new Date())),
  ])

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg lg:max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 pb-24 lg:pb-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Find
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search</h1>
        </div>
        <SearchView todayCode={todayCode} schedule={schedule} instructors={instructors} />
      </div>
    </main>
  )
}
