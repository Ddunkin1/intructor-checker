export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/getUser'
import { AdminPanel } from '@/components/AdminPanel'

export default async function AdminPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  if (!user.isAdmin) redirect('/dashboard')
  return <AdminPanel fullName={user.fullName} />
}
