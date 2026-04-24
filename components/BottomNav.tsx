'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Home, CalendarDays, Search, LayoutDashboard, ClipboardList, Users } from 'lucide-react'

const INSTRUCTOR_TABS = [
  { href: '/dashboard', label: 'Home', icon: Home, match: (p: string) => p === '/dashboard' || p.startsWith('/building') },
  { href: '/my-schedule', label: 'My Day', icon: CalendarDays, match: (p: string) => p === '/my-schedule' },
  { href: '/search', label: 'Search', icon: Search, match: (p: string) => p === '/search' || p.startsWith('/instructor') },
]

const ADMIN_TABS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, match: (_p: string, tab: string | null) => !tab || tab === 'dashboard' },
  { href: '/admin?tab=schedule', label: 'Schedule', icon: ClipboardList, match: (_p: string, tab: string | null) => tab === 'schedule' },
  { href: '/admin?tab=instructors', label: 'Instructors', icon: Users, match: (_p: string, tab: string | null) => tab === 'instructors' },
]

function NavInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  if (pathname === '/login') return null

  const isAdmin = pathname.startsWith('/admin')
  const tabs = isAdmin ? ADMIN_TABS : INSTRUCTOR_TABS

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = isAdmin
            ? match(pathname, tab)
            : (match as (p: string) => boolean)(pathname)
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-1 flex-col items-center justify-center min-h-[56px] py-1.5 transition-colors gap-0.5"
            >
              <span className={[
                'h-[3px] w-8 rounded-full transition-all duration-200 mb-1',
                active ? 'bg-gray-900' : 'bg-transparent',
              ].join(' ')} />
              <Icon className={['w-5 h-5 transition-colors', active ? 'stroke-[2.5] text-gray-900' : 'stroke-2 text-gray-400'].join(' ')} />
              <span className={['text-[10px] font-semibold tracking-wide transition-colors', active ? 'text-gray-900' : 'text-gray-400'].join(' ')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function BottomNav({ isAdmin: _ }: { isAdmin?: boolean } = {}) {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  )
}
