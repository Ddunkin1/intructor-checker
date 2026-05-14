'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, UserPlus, ShieldCheck,
  AlertCircle, CheckCircle2, Clock, Zap, Eye, EyeOff,
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/Modal'
import {
  ALL_DAYS, Building, DayCode, ScheduleEntry, getDayCode,
} from '@/lib/data/scheduleData'
import { formatTime } from '@/lib/utils/timeUtils'
import { findConflicts, sharedDays } from '@/lib/utils/detectConflicts'
import { LogoutButton } from '@/components/LogoutButton'

const BUILDINGS: Building[] = ['CB', 'CBS', 'CBE']

const FLOOR_DEFS = [
  { label: 'Ground Floor', min: 101, max: 125 },
  { label: '2nd Floor',    min: 201, max: 225 },
  { label: '3rd Floor',    min: 301, max: 325 },
  { label: '4th Floor',    min: 401, max: 425 },
]


const TIME_SLOTS = [
  '07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00',
  '16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00',
]

type BuildingFilter = 'all' | Building
type DayFilter = 'all' | DayCode
type AdminTab = 'dashboard' | 'schedule' | 'instructors'

interface InstructorRow {
  id: string
  full_name: string
  email: string
  department: string | null
  is_admin: boolean
  created_at: string
}

const DEPARTMENTS = [
  'Engineering and Technology',
  'Nursing',
  'Accountancy',
  'Business Administration',
  'Teacher Education',
  'Tourism and Hospitality Management',
  'Computer Studies',
  'Arts and Sciences',
  'Criminal Justice Education',
]

const NAME_PREFIXES = ['Prof.', 'Dr.', 'Engr.', 'Atty.', 'Mr.', 'Ms.']

const EMAIL_DOMAIN = 'urios.edu.ph'

function generateEmail(fullName: string): string {
  const name = fullName.trim().toLowerCase().replace(/[^a-z\s]/g, '').trim()
  if (!name) return ''
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return `${parts[0]}@${EMAIL_DOMAIN}`
  return `${parts[0]}.${parts[parts.length - 1]}@${EMAIL_DOMAIN}`
}

function generatePassword(fullName: string): string {
  const name = fullName.trim().toLowerCase().replace(/[^a-z\s]/g, '').trim()
  if (!name) return ''
  const parts = name.split(/\s+/).filter(Boolean)
  const lastName = parts[parts.length - 1]
  return `${lastName}${new Date().getFullYear()}`
}

interface InstructorFormState {
  namePrefix: string
  fullName: string
  email: string
  password: string
  resetPassword: string
  department: string
  isAdmin: boolean
}

const EMPTY_INSTRUCTOR_FORM: InstructorFormState = {
  namePrefix: 'Prof.', fullName: '', email: '', password: '', resetPassword: '', department: '', isAdmin: false,
}

interface FormState {
  subject: string
  title: string
  section: string
  instructor: string
  building: Building
  roomNumber: string
  days: DayCode[]
  startTime: string
  endTime: string
}

const EMPTY_FORM: FormState = {
  subject: '', title: '', section: '', instructor: '',
  building: 'CB', roomNumber: '', days: [],
  startTime: '07:30', endTime: '09:00',
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function entryToForm(e: ScheduleEntry): FormState {
  return {
    subject: e.subject, title: e.title, section: e.section,
    instructor: e.instructor, building: e.building,
    roomNumber: e.room.split(' ')[1] ?? '',
    days: [...e.days], startTime: e.startTime, endTime: e.endTime,
  }
}

function validateForm(form: FormState): string[] {
  const errors: string[] = []
  if (!form.subject.trim()) errors.push('Subject code is required')
  if (!form.section.trim()) errors.push('Section is required')
  if (!form.instructor.trim()) errors.push('Instructor is required')
  if (!form.roomNumber.trim()) errors.push('Room number is required')
  if (form.days.length === 0) errors.push('Select at least one day')
  if (form.startTime >= form.endTime) errors.push('End time must be after start time')
  return errors
}

const DAY_LABELS: Record<DayCode, string> = {
  M: 'Mon', T: 'Tue', W: 'Wed', TH: 'Thu', F: 'Fri',
}

// ─── Inner component (needs useSearchParams) ──────────────────────────────────

function AdminPanelInner({ fullName }: { fullName: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()


  const rawTab = searchParams.get('tab')
  const activeTab: AdminTab =
    rawTab === 'schedule' ? 'schedule' :
    rawTab === 'instructors' ? 'instructors' :
    'dashboard'

  // ── Schedule entries state ────────────────────────────────────────────────
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [entriesLoading, setEntriesLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const loadEntries = useCallback(() => {
    setEntriesLoading(true)
    setFetchError(null)
    fetch('/api/admin/schedule')
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`)
        if (Array.isArray(data)) setEntries(data)
      })
      .catch((err: Error) => {
        console.error('[AdminPanel] loadEntries failed:', err)
        setFetchError(err.message)
      })
      .finally(() => setEntriesLoading(false))
  }, [])

  useEffect(() => { loadEntries() }, [loadEntries])

  // ── Schedule CRUD local state ─────────────────────────────────────────────
  const [buildingFilter, setBuildingFilter] = useState<BuildingFilter>('all')
  const [dayFilter, setDayFilter] = useState<DayFilter>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [formSaving, setFormSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [instructorSearch, setInstructorSearch] = useState('')
  const [instructorDropdownOpen, setInstructorDropdownOpen] = useState(false)

  // ── Instructors state ─────────────────────────────────────────────────────
  const [instructors, setInstructors] = useState<InstructorRow[]>([])
  const [instructorsLoading, setInstructorsLoading] = useState(false)
  const [deleteInstructorModal, setDeleteInstructorModal] = useState<{ open: boolean; instructor: InstructorRow | null }>({ open: false, instructor: null })
  const [instructorDeleting, setInstructorDeleting] = useState(false)

  const loadInstructors = useCallback(() => {
    setInstructorsLoading(true)
    fetch('/api/admin/instructors')
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`)
        if (Array.isArray(data)) setInstructors(data)
      })
      .catch((err: Error) => {
        console.error('[AdminPanel] loadInstructors failed:', err)
        setFetchError(err.message)
      })
      .finally(() => setInstructorsLoading(false))
  }, [])

  useEffect(() => { loadInstructors() }, [loadInstructors])


  // ── Add / edit instructor modal ───────────────────────────────────────────
  const [instructorModalOpen, setInstructorModalOpen] = useState(false)
  const [editingInstructorId, setEditingInstructorId] = useState<string | null>(null)
  const [instructorForm, setInstructorForm] = useState<InstructorFormState>(EMPTY_INSTRUCTOR_FORM)
  const [instructorErrors, setInstructorErrors] = useState<string[]>([])
  const [instructorSaving, setInstructorSaving] = useState(false)
  const [emailIsAuto, setEmailIsAuto] = useState(true)
  const [passwordIsAuto, setPasswordIsAuto] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [justCreatedInstructor, setJustCreatedInstructor] = useState<string | null>(null)

  // ── Semester management ───────────────────────────────────────────────────
  const [semesterLabel, setSemesterLabel] = useState('2nd Semester 2025–2026')
  const [semesterSaving, setSemesterSaving] = useState(false)
  const [clearInput, setClearInput] = useState('')
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('semesterLabel')
    if (saved) setSemesterLabel(saved)
  }, [])

  // ── Derived data ──────────────────────────────────────────────────────────
  const now = new Date()
  const todayCode = getDayCode(now)
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const greeting = getGreeting(now.getHours())

  const activeNow = entries.filter(e =>
    todayCode &&
    e.days.includes(todayCode) &&
    e.startTime <= currentTime &&
    currentTime < e.endTime
  )

  const activeTodayCount = entries.filter(e => todayCode && e.days.includes(todayCode)).length
  const conflicts = findConflicts(entries)
  const conflictIds = new Set(conflicts.flatMap(c => [c.entry1.id, c.entry2.id]))

  const filtered = entries.filter(e => {
    const matchBuilding = buildingFilter === 'all' || e.building === buildingFilter
    const matchDay = dayFilter === 'all' || e.days.includes(dayFilter)
    const q = search.trim().toLowerCase()
    const matchSearch = !q || (
      e.instructor.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.room.toLowerCase().includes(q)
    )
    return matchBuilding && matchDay && matchSearch
  })

  const grouped: Record<string, ScheduleEntry[]> = {}
  for (const b of BUILDINGS) {
    const bEntries = filtered
      .filter(e => e.building === b)
      .sort((a, b) => a.room.localeCompare(b.room) || a.startTime.localeCompare(b.startTime))
    if (bEntries.length > 0) grouped[b] = bEntries
  }

  // ── Schedule CRUD handlers ────────────────────────────────────────────────
  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors([])
    setInstructorSearch('')
    setInstructorDropdownOpen(false)
    setModalOpen(true)
  }

  function openEdit(entry: ScheduleEntry) {
    setEditingId(entry.id)
    setForm(entryToForm(entry))
    setFormErrors([])
    setInstructorSearch('')
    setInstructorDropdownOpen(false)
    setModalOpen(true)
  }

  async function handleSave() {
    const errs = validateForm(form)
    if (errs.length > 0) { setFormErrors(errs); return }

    const room = `${form.building} ${form.roomNumber.trim()}`

    // Conflict check — skip the entry being edited
    const others = entries.filter(e => e.id !== editingId)
    const conflicts: string[] = []
    for (const e of others) {
      const sharesDay = form.days.some(d => e.days.includes(d))
      if (!sharesDay) continue
      const overlaps = form.startTime < e.endTime && e.startTime < form.endTime
      if (!overlaps) continue
      if (e.room === room) {
        conflicts.push(`Room ${room} is already occupied by ${e.instructor} (${e.subject}) on ${e.days.filter(d => form.days.includes(d)).join('/')} at ${formatTime(e.startTime)}–${formatTime(e.endTime)}`)
      }
      if (e.instructor === form.instructor) {
        conflicts.push(`${form.instructor} already has ${e.subject} in ${e.room} on ${e.days.filter(d => form.days.includes(d)).join('/')} at ${formatTime(e.startTime)}–${formatTime(e.endTime)}`)
      }
    }
    if (conflicts.length > 0) { setFormErrors(conflicts); return }

    const payload = {
      subject: form.subject.trim(), title: form.title.trim(),
      section: form.section.trim(), instructor: form.instructor.trim(),
      building: form.building, room, days: [...form.days],
      startTime: form.startTime, endTime: form.endTime,
    }
    setFormSaving(true)
    setFormErrors([])
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/schedule/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) { setFormErrors([data.error ?? 'Failed to save']); return }
        loadEntries()
      } else {
        const res = await fetch('/api/admin/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) { setFormErrors([data.error ?? 'Failed to create']); return }
        loadEntries()
      }
      setModalOpen(false)
    } catch (err) {
      setFormErrors([(err as Error).message])
    } finally {
      setFormSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/schedule/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setFetchError(data.error ?? 'Failed to delete'); return }
      setEntries(prev => prev.filter(e => e.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setFetchError((err as Error).message)
    } finally {
      setDeleting(null)
    }
  }

  function toggleDay(day: DayCode) {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }))
  }

  const endTimeOptions = TIME_SLOTS.filter(t => t > form.startTime)

  // ── Instructor handlers ───────────────────────────────────────────────────
  function openAddInstructor() {
    setEmailIsAuto(true)
    setPasswordIsAuto(true)
    setShowPassword(false)
    setJustCreatedInstructor(null)
    setEditingInstructorId(null)
    setInstructorForm(EMPTY_INSTRUCTOR_FORM)
    setInstructorErrors([])
    setInstructorModalOpen(true)
  }

  function openEditInstructor(inst: InstructorRow) {
    const nameParts = inst.full_name.split(' ')
    const prefix = NAME_PREFIXES.find(p => nameParts[0] === p) ?? 'Prof.'
    const rest = NAME_PREFIXES.includes(nameParts[0]) ? nameParts.slice(1).join(' ') : inst.full_name
    setEditingInstructorId(inst.id)
    setShowPassword(false)
    setInstructorForm({
      namePrefix: prefix,
      fullName: rest,
      email: inst.email,
      password: '',
      resetPassword: '',
      department: inst.department ?? '',
      isAdmin: inst.is_admin,
    })
    setInstructorErrors([])
    setInstructorModalOpen(true)
  }

  async function handleSaveInstructor() {
    const errs: string[] = []
    if (!instructorForm.fullName.trim()) errs.push('Name is required')
    if (!instructorForm.department) errs.push('Department is required')
    if (!editingInstructorId) {
      if (!instructorForm.email.trim()) errs.push('Email is required')
      if (!instructorForm.password.trim()) errs.push('Password is required')
      if (instructorForm.password.length > 0 && instructorForm.password.length < 6)
        errs.push('Password must be at least 6 characters')
    }
    if (editingInstructorId && instructorForm.resetPassword && instructorForm.resetPassword.length < 6)
      errs.push('New password must be at least 6 characters')
    if (errs.length > 0) { setInstructorErrors(errs); return }

    setInstructorSaving(true)
    setInstructorErrors([])
    const composedName = `${instructorForm.namePrefix} ${instructorForm.fullName.trim()}`

    try {
      if (editingInstructorId) {
        const res = await fetch(`/api/admin/instructors/${editingInstructorId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: composedName,
            department: instructorForm.department,
            isAdmin: instructorForm.isAdmin,
            ...(instructorForm.resetPassword ? { newPassword: instructorForm.resetPassword } : {}),
          }),
        })
        const data = await res.json()
        if (!res.ok) { setInstructorErrors([data.error ?? 'Failed to update instructor']); return }
      } else {
        const res = await fetch('/api/admin/create-instructor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...instructorForm, fullName: composedName }),
        })
        const data = await res.json()
        if (!res.ok) { setInstructorErrors([data.error ?? 'Failed to create instructor']); return }
      }
      if (editingInstructorId) {
        setInstructorModalOpen(false)
        setEditingInstructorId(null)
      } else {
        setJustCreatedInstructor(composedName)
      }
      setInstructorForm(EMPTY_INSTRUCTOR_FORM)
      loadInstructors()
    } finally {
      setInstructorSaving(false)
    }
  }

  function handleAddClassForInstructor() {
    const name = justCreatedInstructor!
    setInstructorModalOpen(false)
    setJustCreatedInstructor(null)
    setEditingId(null)
    setForm({ ...EMPTY_FORM, instructor: name })
    setFormErrors([])
    setInstructorSearch('')
    setInstructorDropdownOpen(false)
    setModalOpen(true)
  }

  async function handleDeleteInstructor() {
    const inst = deleteInstructorModal.instructor
    if (!inst) return
    setInstructorDeleting(true)
    try {
      const res = await fetch(`/api/admin/instructors/${inst.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error ?? 'Failed to delete instructor')
        return
      }
      setInstructors(prev => prev.filter(i => i.id !== inst.id))
      setDeleteInstructorModal({ open: false, instructor: null })
    } finally {
      setInstructorDeleting(false)
    }
  }

  // ── Speed Dial FAB ────────────────────────────────────────────────────────
  const [fabOpen, setFabOpen] = useState(false)

  // ── Semester handlers ─────────────────────────────────────────────────────
  function saveSemester() {
    setSemesterSaving(true)
    localStorage.setItem('semesterLabel', semesterLabel)
    setTimeout(() => setSemesterSaving(false), 600)
  }

  async function handleClearEntries() {
    if (clearInput !== 'CLEAR') return
    setClearing(true)
    try {
      const res = await fetch('/api/admin/schedule/clear', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setFetchError(data.error ?? 'Failed to clear entries'); return }
      setEntries([])
      setClearConfirmOpen(false)
      setClearInput('')
    } finally {
      setClearing(false)
    }
  }


  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-lg lg:max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 pb-28 lg:pb-10">

        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Admin</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{fullName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{semesterLabel}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Error banner */}
        {fetchError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-700">Something went wrong</p>
              <p className="text-xs text-red-500 mt-0.5 break-all">{fetchError}</p>
            </div>
            <button onClick={() => setFetchError(null)} className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0">✕</button>
          </div>
        )}

        {/* ═══ DASHBOARD TAB ════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-5 lg:space-y-0">

            {/* Left column */}
            <div className="space-y-5">

              {/* Greeting */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  {greeting},
                </p>
                <p className="text-base text-gray-600">
                  Here's an overview of the current semester schedule.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Classes', value: entriesLoading ? '–' : entries.length },
                  { label: 'Instructors', value: entriesLoading ? '–' : new Set(entries.map(e => e.instructor)).size },
                  { label: 'Active Today', value: entriesLoading ? '–' : activeTodayCount },
                  { label: 'Buildings', value: 3 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl px-2 py-3 text-center shadow-sm border border-gray-100">
                    <p className="text-lg font-black text-gray-900">{value}</p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Right Now */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Right Now</p>
                  <span className="ml-auto text-xs text-gray-400">{formatTime(currentTime)}</span>
                </div>
                {entriesLoading ? (
                  <div className="px-4 py-5 text-sm text-gray-400">Loading…</div>
                ) : activeNow.length === 0 ? (
                  <div className="px-4 py-5 text-sm text-gray-400">No classes in session right now</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {activeNow.map(e => (
                      <div key={e.id} className="px-4 py-3 flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{e.room} · {e.subject}</p>
                          <p className="text-xs text-gray-500 truncate">{e.instructor}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ends at {formatTime(e.endTime)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.98] transition-all text-left"
                  >
                    <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-gray-600" />
                    </span>
                    Add Class
                  </button>
                  <button
                    onClick={openAddInstructor}
                    className="flex items-center gap-2 bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.98] transition-all text-left"
                  >
                    <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4 text-gray-600" />
                    </span>
                    Add Instructor
                  </button>
                </div>
              </div>

            </div>

            {/* Right column */}
            <div className="space-y-5">

              {/* Conflicts */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Schedule Conflicts</p>
                  {conflicts.length > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-bold text-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {conflicts.length} detected
                    </span>
                  )}
                </div>
                {entriesLoading ? (
                  <div className="px-4 py-5 text-sm text-gray-400">Loading…</div>
                ) : conflicts.length === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-4">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <p className="text-sm text-gray-500">No conflicts detected</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conflicts.map(({ entry1, entry2, type }, idx) => {
                      const shared = sharedDays(entry1, entry2).map(d => DAY_LABELS[d as DayCode]).join('/')
                      return (
                        <div key={idx} className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs font-bold text-gray-800">
                                  {type === 'room' ? entry1.room : entry1.instructor} · {shared}
                                </p>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${type === 'room' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                  {type === 'room' ? 'Room conflict' : 'Instructor conflict'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {entry1.subject} ({formatTime(entry1.startTime)}–{formatTime(entry1.endTime)}){' '}
                                overlaps with {entry2.subject} ({formatTime(entry2.startTime)}–{formatTime(entry2.endTime)})
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {type === 'room' ? `${entry1.instructor} vs ${entry2.instructor}` : `${entry1.room} and ${entry2.room}`}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => { router.push('?tab=schedule'); openEdit(entry1) }}
                                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                                >
                                  Edit {entry1.subject}
                                </button>
                                <button
                                  onClick={() => { router.push('?tab=schedule'); openEdit(entry2) }}
                                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                                >
                                  Edit {entry2.subject}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Semester Management */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <Zap className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Settings</p>
                </div>
                <div className="px-4 py-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Current Semester
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={semesterLabel}
                        onChange={e => setSemesterLabel(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      />
                      <button
                        onClick={saveSemester}
                        className="px-4 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors shrink-0"
                      >
                        {semesterSaving ? 'Saved!' : 'Save'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Danger Zone</p>
                    <p className="text-xs text-gray-400 mb-3">
                      Permanently delete all schedule entries for the current semester.
                    </p>
                    <button
                      onClick={() => { setClearInput(''); setClearConfirmOpen(true) }}
                      className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                      Clear All Schedule Entries
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ═══ SCHEDULE TAB ═════════════════════════════════════════════════ */}
        {activeTab === 'schedule' && (
          <>
            <div className="space-y-2 mb-5">
              {/* Building filter */}
              <div className="bg-white rounded-2xl shadow-sm p-1 flex gap-0.5">
                {(['all', ...BUILDINGS] as BuildingFilter[]).map(b => (
                  <button
                    key={b}
                    onClick={() => setBuildingFilter(b)}
                    className={[
                      'flex-1 text-xs font-bold py-2 rounded-xl transition-colors duration-150',
                      buildingFilter === b ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600',
                    ].join(' ')}
                  >
                    {b === 'all' ? 'All' : b}
                  </button>
                ))}
              </div>

              {/* Day filter */}
              <div className="bg-white rounded-2xl shadow-sm p-1 flex gap-0.5">
                {([{ code: 'all', label: 'All Days' }, ...ALL_DAYS] as { code: DayFilter; label: string }[]).map(({ code, label }) => {
                  const count = code === 'all'
                    ? filtered.length
                    : entries.filter(e =>
                        e.days.includes(code as DayCode) &&
                        (buildingFilter === 'all' || e.building === buildingFilter) &&
                        (!search.trim() || e.instructor.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()) || e.room.toLowerCase().includes(search.toLowerCase()))
                      ).length
                  return (
                    <button
                      key={code}
                      onClick={() => setDayFilter(code)}
                      className={[
                        'flex-1 flex flex-col items-center py-1.5 rounded-xl transition-colors duration-150',
                        dayFilter === code ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600',
                      ].join(' ')}
                    >
                      <span className="text-[10px] font-bold leading-tight">{code === 'all' ? 'All' : label}</span>
                      <span className={['text-[9px] font-semibold leading-tight mt-0.5', dayFilter === code ? 'text-gray-300' : 'text-gray-300'].join(' ')}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search instructor, subject, or room…"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Result count */}
              {!entriesLoading && (
                <p className="text-xs text-gray-400 px-1">
                  {filtered.length} {filtered.length === 1 ? 'class' : 'classes'}
                  {dayFilter !== 'all' && ` on ${ALL_DAYS.find(d => d.code === dayFilter)?.label}`}
                  {buildingFilter !== 'all' && ` in ${buildingFilter}`}
                </p>
              )}
            </div>

            {entriesLoading ? (
              <div className="flex justify-center py-16">
                <span className="text-sm text-gray-400">Loading…</span>
              </div>
            ) : (
              <div className="space-y-7">
                {Object.keys(grouped).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm font-semibold text-gray-400">No entries match</p>
                    <p className="text-xs text-gray-300 mt-1">Try a different filter or search</p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([building, buildingEntries]) => (
                    <div key={building}>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                          {building} Building
                        </p>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                          {buildingEntries.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {buildingEntries.map(entry => {
                          const hasConflict = conflictIds.has(entry.id)
                          return (
                          <div key={entry.id} className={`rounded-2xl shadow-sm border px-4 py-3.5 ${hasConflict ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
                            {deleteConfirm === entry.id ? (
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-gray-700">Delete this entry?</p>
                                <div className="flex gap-2 shrink-0">
                                  <button onClick={() => setDeleteConfirm(null)} disabled={deleting === entry.id} className="text-xs font-semibold text-gray-500 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors">Cancel</button>
                                  <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id} className="text-xs font-semibold text-white px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors">{deleting === entry.id ? '…' : 'Delete'}</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className={`text-sm font-bold ${hasConflict ? 'text-red-800' : 'text-gray-900'}`}>{entry.subject}</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${hasConflict ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{entry.section}</span>
                                    {hasConflict && (
                                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">Conflict</span>
                                    )}
                                  </div>
                                  {entry.title && <p className={`text-xs mt-0.5 truncate ${hasConflict ? 'text-red-400' : 'text-gray-400'}`}>{entry.title}</p>}
                                  <p className={`text-xs mt-1 font-medium ${hasConflict ? 'text-red-700' : 'text-gray-600'}`}>{entry.instructor}</p>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className={`text-xs ${hasConflict ? 'text-red-400' : 'text-gray-400'}`}>{entry.room}</span>
                                    <span className={hasConflict ? 'text-red-200' : 'text-gray-200'}>·</span>
                                    <span className={`text-xs ${hasConflict ? 'text-red-400' : 'text-gray-400'}`}>{entry.days.join('/')}</span>
                                    <span className={hasConflict ? 'text-red-200' : 'text-gray-200'}>·</span>
                                    <span className={`text-xs ${hasConflict ? 'text-red-400' : 'text-gray-400'}`}>{formatTime(entry.startTime)}–{formatTime(entry.endTime)}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1.5 shrink-0 mt-0.5">
                                  <button onClick={() => openEdit(entry)} className={`p-1.5 rounded-lg transition-colors ${hasConflict ? 'text-red-400 hover:text-red-700 hover:bg-red-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`} aria-label="Edit">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setDeleteConfirm(entry.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* ═══ INSTRUCTORS TAB ══════════════════════════════════════════════ */}
        {activeTab === 'instructors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {instructorsLoading ? (
              <div className="flex justify-center py-16">
                <span className="text-sm text-gray-400">Loading…</span>
              </div>
            ) : instructors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm font-semibold text-gray-400">No instructors yet</p>
                <p className="text-xs text-gray-300 mt-1">Tap + to add the first one</p>
              </div>
            ) : (
              instructors.map(inst => {
                const classCount = entries.filter(e => e.instructor === inst.full_name).length
                return (
                  <div key={inst.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5">
                    {(
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-gray-500">
                            {inst.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{inst.full_name}</p>
                            {inst.is_admin && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                <ShieldCheck className="w-2.5 h-2.5" />Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{inst.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {classCount} {classCount === 1 ? 'class' : 'classes'} this semester
                            {inst.department ? ` · ${inst.department}` : ''}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => openEditInstructor(inst)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Edit instructor"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteInstructorModal({ open: true, instructor: inst })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Delete instructor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

      </div>

      {/* ── Speed Dial FAB ───────────────────────────────────────────────── */}
      {fabOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setFabOpen(false)} />
      )}
      <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 flex flex-col items-end gap-3 z-40">
        {fabOpen && (
          <>
            <div className="flex items-center gap-2">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                Add Instructor
              </span>
              <button
                onClick={() => { openAddInstructor(); setFabOpen(false) }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                Add Class
              </span>
              <button
                onClick={() => { openAdd(); setFabOpen(false) }}
                className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => setFabOpen(o => !o)}
          className={[
            'w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center active:scale-95 transition-all duration-200',
            fabOpen ? 'rotate-45' : 'rotate-0',
          ].join(' ')}
          aria-label={fabOpen ? 'Close menu' : 'Add'}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* ── Delete Instructor confirmation dialog ────────────────────── */}
      <Dialog open={deleteInstructorModal.open} onOpenChange={open => { if (!open) setDeleteInstructorModal({ open: false, instructor: null }) }}>
        <DialogContent className="bg-white p-0 gap-0 overflow-hidden rounded-3xl w-[calc(100%-2rem)] max-w-sm shadow-2xl border-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-black text-gray-900 pr-8">Delete Instructor</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-2">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <strong>{deleteInstructorModal.instructor?.full_name}</strong>?
            </p>
            <p className="text-xs text-gray-400">
              This will permanently remove their account and they will no longer be able to log in.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => setDeleteInstructorModal({ open: false, instructor: null })}
              disabled={instructorDeleting}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteInstructor}
              disabled={instructorDeleting}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {instructorDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Clear confirmation dialog ─────────────────────────────────── */}
      <Dialog open={clearConfirmOpen} onOpenChange={open => { if (!open) setClearConfirmOpen(false) }}>
        <DialogContent className="bg-white p-0 gap-0 overflow-hidden rounded-3xl w-[calc(100%-2rem)] max-w-sm shadow-2xl border-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-black text-gray-900 pr-8">Clear All Entries</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-600">
              This will permanently delete <strong>all {entries.length} schedule entries</strong> for {semesterLabel}. This cannot be undone.
            </p>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Type <span className="font-black text-gray-800">CLEAR</span> to confirm
              </label>
              <input
                type="text"
                value={clearInput}
                onChange={e => setClearInput(e.target.value)}
                placeholder="CLEAR"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => setClearConfirmOpen(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleClearEntries}
              disabled={clearInput !== 'CLEAR' || clearing}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 transition-colors"
            >
              {clearing ? 'Clearing…' : 'Clear All'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Instructor dialog ─────────────────────────────────────── */}
      <Dialog open={instructorModalOpen} onOpenChange={open => { if (!open) { setInstructorModalOpen(false); setJustCreatedInstructor(null) } }}>
        <DialogContent className="bg-white p-0 gap-0 overflow-hidden rounded-3xl w-[calc(100%-2rem)] max-w-sm shadow-2xl border-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-black text-gray-900 pr-8">
              {justCreatedInstructor ? 'Instructor Added' : editingInstructorId ? 'Edit Instructor' : 'Add Instructor'}
            </DialogTitle>
          </DialogHeader>

          {/* ── Success state ── */}
          {justCreatedInstructor ? (
            <>
              <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{justCreatedInstructor}</p>
                  <p className="text-sm text-gray-500 mt-1">Account created successfully.</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { setInstructorModalOpen(false); setJustCreatedInstructor(null) }}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={handleAddClassForInstructor}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Add Class
                </button>
              </div>
            </>
          ) : (
            <>
          <div className="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-4">
            {instructorErrors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 space-y-1">
                {instructorErrors.map(err => <p key={err} className="text-xs font-semibold text-red-600">{err}</p>)}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
              <div className="flex gap-2">
                <select
                  value={instructorForm.namePrefix}
                  onChange={e => {
                    const newPrefix = e.target.value
                    setInstructorForm(f => ({
                      ...f,
                      namePrefix: newPrefix,
                      ...(emailIsAuto ? { email: generateEmail(f.fullName) } : {}),
                    }))
                  }}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 shrink-0"
                >
                  {NAME_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                  type="text"
                  value={instructorForm.fullName}
                  onChange={e => {
                    const newName = e.target.value
                    setInstructorForm(f => ({
                      ...f,
                      fullName: newName,
                      ...(emailIsAuto ? { email: generateEmail(newName) } : {}),
                      ...(passwordIsAuto ? { password: generatePassword(newName) } : {}),
                    }))
                  }}
                  placeholder="Juan Dela Cruz"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>
            {!editingInstructorId && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                    Email
                    {emailIsAuto && instructorForm.email && (
                      <span className="normal-case text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full tracking-normal">auto</span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={instructorForm.email}
                    onChange={e => {
                      setEmailIsAuto(false)
                      setInstructorForm(f => ({ ...f, email: e.target.value }))
                    }}
                    placeholder={`firstname.lastname@${EMAIL_DOMAIN}`}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                    Password
                    {passwordIsAuto && instructorForm.password && (
                      <span className="normal-case text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full tracking-normal">auto</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={instructorForm.password}
                      onChange={e => {
                        setPasswordIsAuto(false)
                        setInstructorForm(f => ({ ...f, password: e.target.value }))
                      }}
                      placeholder="Min. 6 characters"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Department</label>
              <select
                value={instructorForm.department}
                onChange={e => setInstructorForm(f => ({ ...f, department: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {editingInstructorId && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                  Reset Password <span className="normal-case text-gray-300">(leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={instructorForm.resetPassword}
                    onChange={e => setInstructorForm(f => ({ ...f, resetPassword: e.target.value }))}
                    placeholder="New password…"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => setInstructorModalOpen(false)} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={handleSaveInstructor} disabled={instructorSaving} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {instructorSaving
                ? (editingInstructorId ? 'Saving…' : 'Creating…')
                : (editingInstructorId ? 'Save Changes' : 'Create Account')}
            </button>
          </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add / Edit Class dialog ───────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false) }}>
        <DialogContent className="bg-white p-0 gap-0 overflow-hidden rounded-3xl w-[calc(100%-2rem)] max-w-sm shadow-2xl border-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-black text-gray-900 pr-8">
              {editingId ? 'Edit Class' : 'Add Class'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-4">
            {formErrors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 space-y-1">
                {formErrors.map(err => <p key={err} className="text-xs font-semibold text-red-600">{err}</p>)}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Subject Code</label>
              <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. IT 381" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Subject Title <span className="normal-case text-gray-300">(optional)</span></label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. App Dev & Emerging Tech" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Section</label>
              <input type="text" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="e.g. BSIT 3-IT32" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Instructor</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.instructor ? form.instructor : instructorSearch}
                  onChange={e => {
                    setInstructorSearch(e.target.value)
                    setForm(f => ({ ...f, instructor: '' }))
                    setInstructorDropdownOpen(true)
                  }}
                  onFocus={() => setInstructorDropdownOpen(true)}
                  placeholder="Search instructor…"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                {form.instructor && (
                  <button
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, instructor: '' })); setInstructorSearch(''); setInstructorDropdownOpen(true) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                  >
                    ✕
                  </button>
                )}
                {instructorDropdownOpen && !form.instructor && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {instructors
                      .filter(i => i.full_name.toLowerCase().includes(instructorSearch.toLowerCase()))
                      .map(i => (
                        <button
                          key={i.id}
                          type="button"
                          onMouseDown={() => {
                            setForm(f => ({ ...f, instructor: i.full_name }))
                            setInstructorSearch('')
                            setInstructorDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          <p className="font-semibold">{i.full_name}</p>
                          {i.department && <p className="text-xs text-gray-400">{i.department}</p>}
                        </button>
                      ))}
                    {instructors.filter(i => i.full_name.toLowerCase().includes(instructorSearch.toLowerCase())).length === 0 && (
                      <p className="px-4 py-3 text-sm text-gray-400">No instructors found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Building & Room</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.building}
                  onChange={e => setForm(f => ({ ...f, building: e.target.value as Building, roomNumber: '' }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select
                  value={form.roomNumber}
                  onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="">Select room…</option>
                  {FLOOR_DEFS.map(({ label, min, max }) => (
                    <optgroup key={label} label={label}>
                      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(num => (
                        <option key={num} value={String(num)}>{num}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {form.roomNumber && (() => {
                const floor = FLOOR_DEFS.find(f => {
                  const n = parseInt(form.roomNumber)
                  return n >= f.min && n <= f.max
                })
                return floor ? (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Room: <span className="font-semibold text-gray-700">{form.building} {form.roomNumber}</span> · {floor.label}
                  </p>
                ) : null
              })()}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Days</label>
              <div className="flex gap-2">
                {ALL_DAYS.map(({ code, label }) => (
                  <button key={code} type="button" onClick={() => toggleDay(code)} className={['flex-1 py-2 rounded-xl text-xs font-bold transition-colors duration-150', form.days.includes(code) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'].join(' ')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Start Time</label>
                <select value={form.startTime} onChange={e => { const val = e.target.value; setForm(f => ({ ...f, startTime: val, endTime: f.endTime > val ? f.endTime : TIME_SLOTS[TIME_SLOTS.indexOf(val) + 1] ?? val })) }} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{formatTime(t)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">End Time</label>
                <select value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  {endTimeOptions.map(t => <option key={t} value={t}>{formatTime(t)}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button onClick={() => setModalOpen(false)} disabled={formSaving} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={formSaving} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {formSaving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Class'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

// ─── Public export (Suspense wrapper for useSearchParams) ─────────────────────

export function AdminPanel({ fullName }: { fullName: string }) {
  return (
    <Suspense fallback={null}>
      <AdminPanelInner fullName={fullName} />
    </Suspense>
  )
}
