export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/getUser'
import { createClient } from '@/lib/supabase/server'
import { getEntriesForInstructor } from '@/lib/data/supabaseSchedule'
import { ProfileView } from '@/components/ProfileView'

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('instructors')
    .select('full_name, email, department, avatar_url, office, phone')
    .eq('id', user.id)
    .single()

  const entries = await getEntriesForInstructor(user.fullName)

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-lg lg:max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 pb-24 lg:pb-8">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Account</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        <ProfileView
          userId={user.id}
          fullName={profile?.full_name ?? user.fullName}
          email={profile?.email ?? user.email}
          department={profile?.department ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          office={profile?.office ?? null}
          phone={profile?.phone ?? null}
          entries={entries}
        />
      </div>
    </main>
  )
}
