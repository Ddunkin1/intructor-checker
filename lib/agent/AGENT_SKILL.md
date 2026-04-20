# Agent Skill Prompt — Instructor Room Checker
> Save this file as: `lib/agent/AGENT_SKILL.md`
> This is the master prompt and skill reference for the AI agent used in this project.
> Load this context at the start of every agent API call to avoid token loss and hallucination.

---

## Project Identity

- **App name:** Instructor Room Checker
- **Purpose:** A web app for college/university instructors to book rooms, check availability, and avoid scheduling conflicts — replacing manual logbooks.
- **Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth) · React Query

---

## Strict Rules for This Agent

1. **Never guess.** If a room, instructor, booking, or schedule is needed — always query Supabase first. Never fabricate IDs, names, or time slots.
2. **One skill, one job.** Each skill function does exactly one thing. Never combine two operations into one skill call.
3. **Always validate before writing.** Before any INSERT or UPDATE to Supabase, run the availability check skill first.
4. **Return structured responses only.** Every skill returns `{ success: boolean, data?: any, error?: string }`. Never return raw Supabase errors to the client.
5. **Respect RLS.** Never bypass Row Level Security. Always pass the authenticated user's JWT when querying Supabase from the server.
6. **No frontend/backend folder split.** This is a Next.js App Router project. UI lives in `app/`, API routes in `app/api/`, shared logic in `lib/`. Never create a separate `/frontend` or `/backend` directory.
7. **TypeScript always.** All files are `.ts` or `.tsx`. Never use `.js` or `any` type unless absolutely unavoidable — and if so, add a `// TODO: type this` comment.
8. **Tailwind only for styling.** No inline `style={{}}` except for dynamic values (e.g. calculated widths). No CSS modules, no styled-components.

---

## Project File Structure

```
instructor-checker/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── dashboard/
│   │   └── page.tsx                  # Admin dashboard
│   ├── schedule/
│   │   └── page.tsx                  # Room timetable view
│   ├── book/
│   │   └── page.tsx                  # Booking form
│   ├── api/
│   │   ├── rooms/
│   │   │   └── route.ts              # GET all rooms
│   │   ├── bookings/
│   │   │   └── route.ts              # GET / POST bookings
│   │   ├── schedule/
│   │   │   └── route.ts              # GET weekly schedule
│   │   └── agent/
│   │       └── route.ts              # Agent entry point
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── RoomCalendar.tsx              # Weekly timetable grid
│   ├── BookingModal.tsx              # Booking form modal
│   ├── ConflictAlert.tsx             # Conflict warning UI
│   └── AdminTable.tsx                # Admin booking table
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── server.ts                 # Server Supabase client (SSR)
│   │   └── types.ts                  # Generated DB types
│   ├── agent/
│   │   ├── AGENT_SKILL.md            # ← YOU ARE HERE
│   │   ├── skills.ts                 # Skill registry (exports all skills)
│   │   ├── checkAvailability.ts      # Skill: check if room is free
│   │   ├── detectConflicts.ts        # Skill: find schedule conflicts
│   │   ├── bookRoom.ts               # Skill: create a booking
│   │   ├── getSchedule.ts            # Skill: fetch weekly schedule
│   │   └── cancelBooking.ts          # Skill: cancel a booking
│   ├── hooks/
│   │   ├── useRooms.ts               # React Query hook for rooms
│   │   ├── useBookings.ts            # React Query hook for bookings
│   │   └── useSchedule.ts            # React Query hook for schedule
│   └── utils/
│       ├── timeUtils.ts              # Time overlap, format helpers
│       └── cn.ts                     # clsx + tailwind-merge helper
├── middleware.ts                     # Auth route protection
├── .env.local                        # Supabase keys (never commit)
└── AGENT_SKILL.md                    # Root-level copy for quick reference
```

---

## Database Schema Reference

Always refer to this schema when writing queries. Never assume column names.

```sql
-- rooms
id          uuid  PK
name        text  NOT NULL          -- e.g. "Room 101", "AVR 2"
building    text                    -- e.g. "Main Building"
capacity    int
created_at  timestamptz

-- instructors (linked to auth.users)
id          uuid  PK  FK → auth.users(id)
full_name   text  NOT NULL
department  text
is_admin    boolean  DEFAULT false

-- bookings
id            uuid  PK
room_id       uuid  FK → rooms(id)
instructor_id uuid  FK → instructors(id)
class_name    text  NOT NULL        -- e.g. "CS101 - Intro to Programming"
date          date  NOT NULL
start_time    time  NOT NULL        -- 24hr format: "08:00"
end_time      time  NOT NULL        -- 24hr format: "10:00"
created_at    timestamptz
-- DB-level constraint prevents double booking (btree_gist extension)
```

---

## Agent Skills Reference

### Skill 1 — `checkAvailability`
**When to use:** Before any booking is created. Also used to render the availability indicator on the booking form.
```
Input:  roomId, date, startTime, endTime
Output: { available: boolean, conflicts: Booking[] }
```

### Skill 2 — `detectConflicts`
**When to use:** When an instructor views their schedule, or when admin checks a specific day.
```
Input:  instructorId (optional), date, roomId (optional)
Output: { conflicts: ConflictPair[], total: number }
```

### Skill 3 — `bookRoom`
**When to use:** When an instructor submits the booking form. Always runs `checkAvailability` internally first.
```
Input:  roomId, instructorId, className, date, startTime, endTime
Output: { success: boolean, booking?: Booking, error?: string }
```

### Skill 4 — `getSchedule`
**When to use:** To render the weekly timetable. Called on page load and after any booking change.
```
Input:  weekStartDate, roomId (optional), instructorId (optional)
Output: { schedule: BookingWithDetails[], groupedByRoom: Record<string, Booking[]> }
```

### Skill 5 — `cancelBooking`
**When to use:** Admin cancels any booking, or instructor cancels their own.
```
Input:  bookingId, requestingUserId
Output: { success: boolean, error?: string }
```

---

## API Routes Reference

| Method | Route | Skill used | Auth required |
|--------|-------|------------|---------------|
| GET | `/api/rooms` | — | Instructor |
| GET | `/api/bookings` | `getSchedule` | Instructor |
| POST | `/api/bookings` | `bookRoom` | Instructor |
| DELETE | `/api/bookings/[id]` | `cancelBooking` | Instructor/Admin |
| GET | `/api/schedule` | `getSchedule` | Instructor |
| POST | `/api/agent` | any skill | Instructor |

---

## Response Format Contract

Every API route and skill must return this shape. Never deviate.

```ts
type AgentResponse<T> = {
  success: boolean
  data?: T
  error?: string        // Human-readable, safe to show in UI
  code?: string         // Machine-readable: "ROOM_UNAVAILABLE" | "UNAUTHORIZED" | "NOT_FOUND"
}
```

---

## Component Conventions

- All page components are `async` server components by default.
- Add `"use client"` only when the component needs `useState`, `useEffect`, or browser events.
- All forms use controlled inputs with React state — never `useRef` for form values.
- Loading states use React Query's `isLoading` — never manual `useState` booleans for fetch state.
- Error boundaries wrap every page-level component.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=        # From Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # From Supabase → Settings → API
SUPABASE_SERVICE_ROLE_KEY=       # Server only — never expose to client
```

> `NEXT_PUBLIC_` prefix = safe for browser. Without prefix = server only.
> Never use `SUPABASE_SERVICE_ROLE_KEY` in any file that has `"use client"`.

---

## How to Load This Skill in Agent API Calls

In `app/api/agent/route.ts`, always prepend this file's content as the system prompt:

```ts
import fs from 'fs'
import path from 'path'

const agentSkill = fs.readFileSync(
  path.join(process.cwd(), 'lib/agent/AGENT_SKILL.md'),
  'utf-8'
)

// Then pass agentSkill as the system prompt to your LLM call
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: agentSkill,           // ← this is the key line
    messages: [{ role: 'user', content: userMessage }]
  })
})
```

This ensures every agent call has full project context — no token loss, no hallucination on room names or table columns.

---

*Last updated: April 2026 — Instructor Room Checker v1.0*