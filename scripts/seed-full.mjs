// Run: node scripts/seed-full.mjs
// Generates all 4,536 entries (18 rooms × 4 floors × 3 buildings × 21 slots)
// covering Mon–Fri morning to evening in every room.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jkofrryolguynhicibaf.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb2ZycnlvbGd1eW5oaWNpYmFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY4NTQxNCwiZXhwIjoyMDkyMjYxNDE0fQ.XgFiCKVJDbHXnqdy5soLnW1ivAkDr_P7jUUppQBP404'

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Configuration ─────────────────────────────────────────────────────────────

const BUILDINGS = ['CB', 'CBS', 'CBE']
const FLOORS    = [1, 2, 3, 4]
const ROOMS     = 18   // 101–118 per floor

// 1.5-hour slot pairs covering 07:30 → 19:00
const SLOTS = [
  ['07:30:00','09:00:00'],
  ['09:00:00','10:30:00'],
  ['10:30:00','12:00:00'],
  ['12:00:00','13:30:00'],
  ['13:30:00','15:00:00'],
  ['15:00:00','16:30:00'],
  ['17:30:00','19:00:00'],
]

// 3 day patterns — no time conflicts between patterns
const DAY_PATTERNS = [['M','TH'], ['T','F'], ['W']]

// ── Per-building data ─────────────────────────────────────────────────────────

const DATA = {
  CB: {
    // Prof. Anoc excluded here — her specific classes are added manually below
    instructors: [
      'Prof. Dela Cruz','Prof. Santos','Prof. Reyes','Prof. Villanueva',
      'Prof. Lim','Prof. Tan','Prof. Cruz','Prof. Alcantara','Prof. Buenaflor',
    ],
    subjectPrefixes: ['CC','IT','IT','CS','IT','CS','IT','IT','IT','IT','CS','IT','IT','CS'],
    subjectTitles: [
      'Programming Fundamentals','Data Structures & Algorithms','Object-Oriented Programming',
      'Discrete Mathematics','Database Systems','Computer Architecture','Operating Systems',
      'Computer Networks','Web Development','Mobile Development','Software Engineering',
      'Information Security','Cloud Computing','Machine Learning',
    ],
    sections: [
      ['BSIT 1-A','BSIT 1-B','BSIT 1-C','BSCS 1-A','BSCS 1-B','BSIT 1-D'],
      ['BSIT 2-A','BSIT 2-B','BSIT 2-C','BSCS 2-A','BSCS 2-B','BSIT 2-D'],
      ['BSIT 3-A','BSIT 3-B','BSIT 3-C','BSCS 3-A','BSCS 3-B','BSIT 3-D'],
      ['BSIT 4-A','BSIT 4-B','BSIT 4-C','BSCS 4-A','BSCS 4-B','BSIT 4-D'],
    ],
  },
  CBS: {
    instructors: [
      'Prof. Bautista','Prof. Flores','Prof. Garcia','Prof. Mendoza','Prof. Torres',
      'Prof. Rivera','Prof. Campos','Prof. Soriano','Prof. Valenzuela',
    ],
    subjectPrefixes: ['BA','ACCT','FIN','MGT','MKT','ECON','BA','ACCT','FIN','MGT','MKT','ECON','BA','ACCT'],
    subjectTitles: [
      'Principles of Management','Financial Accounting','Business Finance',
      'Operations Management','Marketing Management','Microeconomics',
      'Business Law','Cost Accounting','Investment Management','Strategic Management',
      'Consumer Behavior','Macroeconomics','Business Communication','Managerial Accounting',
    ],
    sections: [
      ['BSBA 1-A','BSBA 1-B','BSBA 1-C','BSA 1-A','BSA 1-B','BSBA 1-D'],
      ['BSBA 2-A','BSBA 2-B','BSBA 2-C','BSA 2-A','BSA 2-B','BSBA 2-D'],
      ['BSBA 3-A','BSBA 3-B','BSBA 3-C','BSA 3-A','BSA 3-B','BSBA 3-D'],
      ['BSBA 4-A','BSBA 4-B','BSBA 4-C','BSA 4-A','BSA 4-B','BSBA 4-D'],
    ],
  },
  CBE: {
    instructors: [
      'Prof. Castro','Prof. Aquino','Prof. Ramos','Prof. Fernandez','Prof. Navarro',
      'Prof. Domingo','Prof. Santiago','Prof. Macaraeg','Prof. Tolentino',
    ],
    subjectPrefixes: ['EDUC','TOUR','HRM','PE','EDUC','TOUR','HRM','GE','NSTP','EDUC','TOUR','HRM','PE','GE'],
    subjectTitles: [
      'Principles of Teaching','Introduction to Tourism','Hotel Management',
      'Physical Fitness','Curriculum Development','Tour Guiding Services',
      'Food & Beverage Service','Purposive Communication','Civic Welfare Training',
      'Assessment & Evaluation','Sustainable Tourism','Front Office Operations',
      'Rhythmic Activities','The Contemporary World',
    ],
    sections: [
      ['BSED 1-A','BSED 1-B','BSTM 1-A','BSTM 1-B','BSHRM 1-A','BSHRM 1-B'],
      ['BSED 2-A','BSED 2-B','BSTM 2-A','BSTM 2-B','BSHRM 2-A','BSHRM 2-B'],
      ['BSED 3-A','BSED 3-B','BSTM 3-A','BSTM 3-B','BSHRM 3-A','BSHRM 3-B'],
      ['BSED 4-A','BSED 4-B','BSTM 4-A','BSTM 4-B','BSHRM 4-A','BSHRM 4-B'],
    ],
  },
}

// ── Generate entries ──────────────────────────────────────────────────────────

function mod(n, m) { return ((n % m) + m) % m }

function generateEntries() {
  const entries = []

  for (const building of BUILDINGS) {
    const { instructors, subjectPrefixes, subjectTitles, sections } = DATA[building]
    const nI = instructors.length       // 10
    const nS = subjectPrefixes.length   // 14
    const nSec = sections[0].length     // 6

    for (const floor of FLOORS) {
      for (let r = 1; r <= ROOMS; r++) {
        const room = `${building} ${floor * 100 + r}`

        for (let dp = 0; dp < DAY_PATTERNS.length; dp++) {
          const days = DAY_PATTERNS[dp]

          for (let s = 0; s < SLOTS.length; s++) {
            const instrIdx  = mod(r + s + dp - 1, nI)
            const subjIdx   = mod(r + s + dp - 2, nS)
            const sectIdx   = mod(s + r + dp - 2, nSec)
            const subjNum   = floor * 100 + mod(r * 3 + s * 7 + dp * 5, 25) + 1

            entries.push({
              subject:        subjectPrefixes[subjIdx] + ' ' + subjNum,
              title:          subjectTitles[subjIdx],
              section:        sections[floor - 1][sectIdx],
              days,
              start_time:     SLOTS[s][0],
              end_time:       SLOTS[s][1],
              room,
              building,
              instructor_name: instructors[instrIdx],
            })
          }
        }
      }
    }
  }

  return entries
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('Clearing schedule_entries...')
  const { error: delErr } = await db
    .from('schedule_entries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (delErr) { console.error('Delete failed:', delErr.message); process.exit(1) }

  const entries = generateEntries()
  console.log(`Inserting ${entries.length} entries in batches of 200...`)

  const BATCH = 200
  let inserted = 0
  for (let i = 0; i < entries.length; i += BATCH) {
    const { error } = await db.from('schedule_entries').insert(entries.slice(i, i + BATCH))
    if (error) { console.error(`Batch ${i} failed:`, error.message); process.exit(1) }
    inserted += Math.min(BATCH, entries.length - i)
    process.stdout.write(`\r  ✓ ${inserted}/${entries.length}`)
  }

  // ── Prof. Anoc's own schedule (realistic load, spread across all 3 buildings) ──
  const anocClasses = [
    // CB
    { subject:'IT 381', title:'Application Development',   section:'BSIT 3-A', days:['M','TH'], start_time:'10:30:00', end_time:'12:00:00', room:'CB 202',  building:'CB',  instructor_name:'Prof. Anoc' },
    { subject:'IT 380', title:'Fundamentals of Database',  section:'BSIT 3-B', days:['T','F'],  start_time:'09:00:00', end_time:'10:30:00', room:'CB 203',  building:'CB',  instructor_name:'Prof. Anoc' },
    { subject:'IT 382', title:'Systems Administration',    section:'BSIT 3-A', days:['M','TH'], start_time:'15:00:00', end_time:'16:30:00', room:'CB 301',  building:'CB',  instructor_name:'Prof. Anoc' },
    { subject:'IT 215', title:'Data Communications',       section:'BSIT 2-C', days:['M','W','F'], start_time:'09:00:00', end_time:'10:00:00', room:'CB 104', building:'CB', instructor_name:'Prof. Anoc' },
    // CBS
    { subject:'IC-RES 130', title:'Elements of Research',  section:'BSIT 3-B', days:['T','F'],  start_time:'07:30:00', end_time:'09:00:00', room:'CBS 102', building:'CBS', instructor_name:'Prof. Anoc' },
    { subject:'IT 216', title:'Software Engineering',      section:'BSIT 2-C', days:['M','W','F'], start_time:'13:00:00', end_time:'14:00:00', room:'CBS 104', building:'CBS', instructor_name:'Prof. Anoc' },
    // CBE
    { subject:'IT 383-EL4', title:'Web Systems & Technologies', section:'BSED 3-A', days:['M','TH'], start_time:'07:30:00', end_time:'09:00:00', room:'CBE 201', building:'CBE', instructor_name:'Prof. Anoc' },
    { subject:'IT 217', title:'Human-Computer Interaction', section:'BSED 2-B', days:['M','W','F'], start_time:'10:00:00', end_time:'11:00:00', room:'CBE 104', building:'CBE', instructor_name:'Prof. Anoc' },
  ]
  const { error: anocErr } = await db.from('schedule_entries').insert(anocClasses)
  if (anocErr) { console.error('Prof. Anoc insert failed:', anocErr.message); process.exit(1) }
  console.log(`  ✓ Added Prof. Anoc's ${anocClasses.length} classes (CB, CBS, CBE)`)

  console.log(`\nDone! ${inserted + anocClasses.length} total entries across ${BUILDINGS.length} buildings.`)
  console.log(`Every room: 7 slots × 3 day patterns (Mon/Thu · Tue/Fri · Wed) = 21 classes/room`)
  console.log(`Prof. Anoc: ${anocClasses.length} classes only (as expected for one instructor)`)
}

run().catch(console.error)
