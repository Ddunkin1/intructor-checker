// Run: node scripts/seed-instructors.mjs
// Creates all instructor accounts from seed data.
// Password format: lastname2026 (e.g. delacruz2026)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jkofrryolguynhicibaf.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb2ZycnlvbGd1eW5oaWNpYmFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY4NTQxNCwiZXhwIjoyMDkyMjYxNDE0fQ.XgFiCKVJDbHXnqdy5soLnW1ivAkDr_P7jUUppQBP404'
const EMAIL_DOMAIN = 'urios.edu.ph'
const YEAR = 2026

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// fullName must match exactly what's used in schedule_entries instructor_name
const INSTRUCTORS = [
  // Fix: update Prof. Anoc's full_name to match schedule entries
  { fullName: 'Prof. Anoc',        email: 'nelvi.anoc@urios.edu.ph',       password: `anoc${YEAR}`,        department: 'Computer Studies',                  updateOnly: true },
  // CB — Computer Studies
  { fullName: 'Prof. Dela Cruz',   email: 'dela.cruz@urios.edu.ph',        password: `delacruz${YEAR}`,    department: 'Computer Studies' },
  { fullName: 'Prof. Santos',      email: 'santos@urios.edu.ph',           password: `santos${YEAR}`,      department: 'Computer Studies' },
  { fullName: 'Prof. Reyes',       email: 'reyes@urios.edu.ph',            password: `reyes${YEAR}`,       department: 'Computer Studies' },
  { fullName: 'Prof. Villanueva',  email: 'villanueva@urios.edu.ph',       password: `villanueva${YEAR}`,  department: 'Computer Studies' },
  // CBS — Business Studies
  { fullName: 'Prof. Bautista',    email: 'bautista@urios.edu.ph',         password: `bautista${YEAR}`,    department: 'Business Administration' },
  { fullName: 'Prof. Flores',      email: 'flores@urios.edu.ph',           password: `flores${YEAR}`,      department: 'Accountancy' },
  { fullName: 'Prof. Garcia',      email: 'garcia@urios.edu.ph',           password: `garcia${YEAR}`,      department: 'Business Administration' },
  { fullName: 'Prof. Mendoza',     email: 'mendoza@urios.edu.ph',          password: `mendoza${YEAR}`,     department: 'Business Administration' },
  { fullName: 'Prof. Torres',      email: 'torres@urios.edu.ph',           password: `torres${YEAR}`,      department: 'Business Administration' },
  // CBE — Business Education
  { fullName: 'Prof. Castro',      email: 'castro@urios.edu.ph',           password: `castro${YEAR}`,      department: 'Teacher Education' },
  { fullName: 'Prof. Aquino',      email: 'aquino@urios.edu.ph',           password: `aquino${YEAR}`,      department: 'Tourism and Hospitality Management' },
  { fullName: 'Prof. Ramos',       email: 'ramos@urios.edu.ph',            password: `ramos${YEAR}`,       department: 'Tourism and Hospitality Management' },
  { fullName: 'Prof. Fernandez',   email: 'fernandez@urios.edu.ph',        password: `fernandez${YEAR}`,   department: 'Teacher Education' },
  { fullName: 'Prof. Navarro',     email: 'navarro@urios.edu.ph',          password: `navarro${YEAR}`,     department: 'Teacher Education' },
  // CB — additional Computer Studies
  { fullName: 'Prof. Lim',         email: 'lim@urios.edu.ph',              password: `lim${YEAR}`,         department: 'Computer Studies' },
  { fullName: 'Prof. Tan',         email: 'tan@urios.edu.ph',              password: `tan${YEAR}`,         department: 'Computer Studies' },
  { fullName: 'Prof. Cruz',        email: 'cruz@urios.edu.ph',             password: `cruz${YEAR}`,        department: 'Computer Studies' },
  { fullName: 'Prof. Alcantara',   email: 'alcantara@urios.edu.ph',        password: `alcantara${YEAR}`,   department: 'Computer Studies' },
  { fullName: 'Prof. Espinosa',    email: 'espinosa@urios.edu.ph',         password: `espinosa${YEAR}`,    department: 'Computer Studies' },
  { fullName: 'Prof. Buenaflor',   email: 'buenaflor@urios.edu.ph',        password: `buenaflor${YEAR}`,   department: 'Computer Studies' },
  // CBS — additional Business Studies
  { fullName: 'Prof. Rivera',      email: 'rivera@urios.edu.ph',           password: `rivera${YEAR}`,      department: 'Business Administration' },
  { fullName: 'Prof. Campos',      email: 'campos@urios.edu.ph',           password: `campos${YEAR}`,      department: 'Accountancy' },
  { fullName: 'Prof. Soriano',     email: 'soriano@urios.edu.ph',          password: `soriano${YEAR}`,     department: 'Economics' },
  { fullName: 'Prof. Valenzuela',  email: 'valenzuela@urios.edu.ph',       password: `valenzuela${YEAR}`,  department: 'Business Administration' },
  // CBE — additional Business Education
  { fullName: 'Prof. Domingo',     email: 'domingo@urios.edu.ph',          password: `domingo${YEAR}`,     department: 'Teacher Education' },
  { fullName: 'Prof. Santiago',    email: 'santiago@urios.edu.ph',         password: `santiago${YEAR}`,    department: 'Tourism Management' },
  { fullName: 'Prof. Macaraeg',    email: 'macaraeg@urios.edu.ph',         password: `macaraeg${YEAR}`,    department: 'Hospitality Management' },
  { fullName: 'Prof. Tolentino',   email: 'tolentino@urios.edu.ph',        password: `tolentino${YEAR}`,   department: 'Physical Education' },
]

async function run() {
  let created = 0
  let updated = 0
  let skipped = 0

  for (const inst of INSTRUCTORS) {
    if (inst.updateOnly) {
      // Just rename the existing instructor row to match schedule entries
      const { error } = await admin
        .from('instructors')
        .update({ full_name: inst.fullName })
        .eq('email', inst.email)
      if (error) {
        console.error(`  ✗ Update ${inst.fullName}: ${error.message}`)
      } else {
        console.log(`  ✓ Updated: ${inst.fullName} (${inst.email})`)
        updated++
      }
      continue
    }

    // Create auth user
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: inst.email,
      password: inst.password,
      email_confirm: true,
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`  ↷ Skipped (exists): ${inst.fullName}`)
        skipped++
      } else {
        console.error(`  ✗ Auth error for ${inst.fullName}: ${authError.message}`)
      }
      continue
    }

    // Insert into instructors table
    const { error: dbError } = await admin.from('instructors').insert({
      id: authData.user.id,
      full_name: inst.fullName,
      email: inst.email,
      department: inst.department,
      is_admin: false,
    })

    if (dbError) {
      await admin.auth.admin.deleteUser(authData.user.id)
      console.error(`  ✗ DB error for ${inst.fullName}: ${dbError.message}`)
      continue
    }

    console.log(`  ✓ Created: ${inst.fullName} — ${inst.email} / ${inst.password}`)
    created++
  }

  console.log(`\nDone. ${created} created, ${updated} updated, ${skipped} skipped.`)
  console.log('\nPassword summary:')
  INSTRUCTORS.filter(i => !i.updateOnly).forEach(i =>
    console.log(`  ${i.fullName.padEnd(22)} ${i.password}`)
  )
}

run().catch(console.error)
