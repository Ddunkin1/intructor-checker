'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import {
  Home, CalendarDays, Search, LayoutDashboard, ClipboardList,
  Users, BookOpen, LogOut, UserCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const INSTRUCTOR_TABS = [
  { href: '/dashboard',   label: 'Home',    icon: Home,          match: (p: string) => p === '/dashboard' || p.startsWith('/building') },
  { href: '/my-schedule', label: 'My Day',  icon: CalendarDays,  match: (p: string) => p === '/my-schedule' },
  { href: '/search',      label: 'Search',  icon: Search,        match: (p: string) => p === '/search' || p.startsWith('/instructor') },
  { href: '/profile',     label: 'Profile', icon: UserCircle,    match: (p: string) => p === '/profile' },
]

const ADMIN_TABS = [
  { href: '/admin',                 label: 'Dashboard',   icon: LayoutDashboard, match: (_p: string, tab: string | null) => !tab || tab === 'dashboard' },
  { href: '/admin?tab=schedule',    label: 'Schedule',    icon: ClipboardList,   match: (_p: string, tab: string | null) => tab === 'schedule' },
  { href: '/admin?tab=instructors', label: 'Instructors', icon: Users,           match: (_p: string, tab: string | null) => tab === 'instructors' },
]

function SidebarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const router = useRouter()

  if (pathname === '/login') return null

  const isAdmin = pathname.startsWith('/admin')
  const tabs = isAdmin ? ADMIN_TABS : INSTRUCTOR_TABS

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-2xl flex items-center justify-center shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 leading-tight">Room Checker</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {isAdmin ? 'Admin' : 'Instructor'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = isAdmin
            ? (match as (p: string, tab: string | null) => boolean)(pathname, tab)
            : (match as (p: string) => boolean)(pathname)
          return (
            <Link
              key={label}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                active
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export function SidebarNav() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  )
}
