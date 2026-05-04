'use client'

import { useState, useRef } from 'react'
import {
  Camera, MapPin, Phone, Lock, CheckCircle2,
  Eye, EyeOff, BookOpen, Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ScheduleEntry } from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'

const BUILDINGS: { id: string; label: string }[] = [
  { id: 'CB', label: 'CB Building' },
  { id: 'CBS', label: 'CBS Building' },
  { id: 'CBE', label: 'CBE Building' },
]

interface Props {
  userId: string
  fullName: string
  email: string
  department: string | null
  avatarUrl: string | null
  office: string | null
  phone: string | null
  entries: ScheduleEntry[]
}

export function ProfileView({ userId, fullName, email, department, avatarUrl: initialAvatarUrl, office: initialOffice, phone: initialPhone, entries }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  // Contact
  const [office, setOffice] = useState(initialOffice ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [contactSaving, setContactSaving] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // ── Avatar upload ──────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setAvatarError(data.error ?? 'Upload failed'); return }
      setAvatarUrl(data.url)
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  // ── Contact save ───────────────────────────────────────────────────────────
  async function handleContactSave() {
    setContactError(null)
    setContactSuccess(false)
    setContactSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ office, phone }),
      })
      const data = await res.json()
      if (!res.ok) { setContactError(data.error ?? 'Failed to save'); return }
      setContactSuccess(true)
      setTimeout(() => setContactSuccess(false), 3000)
    } finally {
      setContactSaving(false)
    }
  }

  // ── Password change ────────────────────────────────────────────────────────
  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordError(null)
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return }

    setPasswordSaving(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
      if (signInError) { setPasswordError('Current password is incorrect'); return }
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) { setPasswordError(updateError.message); return }
      setPasswordSuccess(true)
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } finally {
      setPasswordSaving(false)
    }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const grouped = BUILDINGS.map(b => ({
    ...b,
    entries: entries.filter(e => e.building === b.id).sort((a, b) => a.room.localeCompare(b.room) || a.startTime.localeCompare(b.startTime)),
  })).filter(b => b.entries.length > 0)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-8 lg:items-start space-y-5 lg:space-y-0">

      {/* ── Left column (info + forms) ──────────────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">

        {/* Avatar + identity */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-5 py-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-black text-gray-400">{initials}</span>
                  </div>
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                    <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 hover:bg-gray-700 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
                aria-label="Upload photo"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 leading-tight truncate">{fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
              {department && (
                <span className="inline-block mt-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {department}
                </span>
              )}
            </div>
          </div>
          {avatarError && (
            <p className="text-xs text-red-500 font-semibold mt-3 bg-red-50 px-3 py-2 rounded-xl">{avatarError}</p>
          )}
          <p className="text-[10px] text-gray-300 mt-3 text-center">Tap the camera icon to upload a photo · Max 2 MB</p>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Contact Info</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Office Room
              </label>
              <input
                type="text"
                value={office}
                onChange={e => { setOffice(e.target.value); setContactSuccess(false) }}
                placeholder="e.g. CB 204"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Contact Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setContactSuccess(false) }}
                placeholder="e.g. 09XX XXX XXXX"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            {contactError && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{contactError}</p>
            )}
            <button
              onClick={handleContactSave}
              disabled={contactSaving}
              className={[
                'w-full py-2.5 rounded-xl text-sm font-bold transition-all',
                contactSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50',
              ].join(' ')}
            >
              {contactSaving ? 'Saving…' : contactSuccess ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Change Password</p>
          </div>

          {passwordSuccess ? (
            <div className="px-5 py-8 flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm font-semibold text-gray-800">Password updated successfully.</p>
              <button onClick={() => setPasswordSuccess(false)} className="text-xs text-gray-400 underline">
                Change again
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="px-5 py-4 space-y-3">
              {passwordError && (
                <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{passwordError}</p>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Your current password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
                  <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
                  <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat new password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
              </div>
              <button type="submit" disabled={passwordSaving} className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {passwordSaving ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

      </div>

      {/* ── Right column (schedule) ─────────────────────────────────────── */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">My Classes This Semester</p>
            <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {entries.length} {entries.length === 1 ? 'class' : 'classes'}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">No classes assigned this semester.</p>
              <p className="text-xs text-gray-300 mt-1">Contact your administrator to be assigned classes.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {grouped.map(({ id, label, entries: bEntries }) => (
                <div key={id}>
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">{bEntries.length}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {bEntries.map(entry => (
                      <div key={entry.id} className="px-5 py-3 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-black text-gray-500 text-center leading-tight">{entry.building}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{entry.subject}</p>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{entry.section}</span>
                          </div>
                          {entry.title && <p className="text-xs text-gray-400 truncate mt-0.5">{entry.title}</p>}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium">{entry.room}</span>
                            <span className="text-gray-200">·</span>
                            <span className="text-xs text-gray-400">{entry.days.join('/')}</span>
                            <span className="text-gray-200">·</span>
                            <span className="text-xs text-gray-400">{formatTime(entry.startTime)}–{formatTime(entry.endTime)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
