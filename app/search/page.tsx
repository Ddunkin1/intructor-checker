import { getDayCode } from '@/lib/data/scheduleData'
import { SearchView } from '@/components/SearchView'

export default function SearchPage() {
  const todayCode = getDayCode(new Date())

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-24">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Find
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Search</h1>
        </div>
        <SearchView todayCode={todayCode} />
      </div>
    </main>
  )
}
