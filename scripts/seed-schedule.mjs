// Run: node scripts/seed-schedule.mjs
// Clears schedule_entries and inserts full demo data for all 3 buildings.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jkofrryolguynhicibaf.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb2ZycnlvbGd1eW5oaWNpYmFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjY4NTQxNCwiZXhwIjoyMDkyMjYxNDE0fQ.XgFiCKVJDbHXnqdy5soLnW1ivAkDr_P7jUUppQBP404'

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ENTRIES = [
  // ── CB ── College of Computer Studies ───────────────────────────────────────

  // Ground Floor — existing instructors
  { subject: 'IT 381',     title: 'Application Development',         section: 'BSIT 3-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CB 202',  building: 'CB', instructor_name: 'Prof. Anoc' },
  { subject: 'IT 380',     title: 'Fundamentals of Database',        section: 'BSIT 3-B', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 203',  building: 'CB', instructor_name: 'Prof. Anoc' },
  { subject: 'IT 382',     title: 'Systems Administration',          section: 'BSIT 3-A', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CB 301',  building: 'CB', instructor_name: 'Prof. Anoc' },
  { subject: 'IT 215',     title: 'Data Communications',             section: 'BSIT 2-C', days: ['M','W','F'], start_time: '09:00:00', end_time: '10:00:00', room: 'CB 104',  building: 'CB', instructor_name: 'Prof. Anoc' },

  { subject: 'CC 101',     title: 'Introduction to Computing',       section: 'BSIT 1-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 101',  building: 'CB', instructor_name: 'Prof. Dela Cruz' },
  { subject: 'CC 102',     title: 'Computer Programming 1',          section: 'BSIT 1-B', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CB 101',  building: 'CB', instructor_name: 'Prof. Dela Cruz' },
  { subject: 'CC 103',     title: 'Computer Programming 2',          section: 'BSIT 1-A', days: ['M','W','F'], start_time: '12:00:00', end_time: '13:00:00', room: 'CB 102',  building: 'CB', instructor_name: 'Prof. Dela Cruz' },

  { subject: 'IT 213',     title: 'Discrete Mathematics',            section: 'BSIT 2-A', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 102',  building: 'CB', instructor_name: 'Prof. Santos' },
  { subject: 'IT 212',     title: 'Object-Oriented Programming',     section: 'BSIT 2-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CB 202',  building: 'CB', instructor_name: 'Prof. Santos' },
  { subject: 'CC 104',     title: 'Data Structures & Algorithms',    section: 'BSIT 2-A', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CB 103',  building: 'CB', instructor_name: 'Prof. Santos' },

  { subject: 'IT 321',     title: 'Computer Networks',               section: 'BSIT 3-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 301',  building: 'CB', instructor_name: 'Prof. Reyes' },
  { subject: 'IT 322',     title: 'Information Security',            section: 'BSIT 3-A', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 302',  building: 'CB', instructor_name: 'Prof. Reyes' },
  { subject: 'IT 411',     title: 'Network Administration',          section: 'BSIT 4-A', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CB 401',  building: 'CB', instructor_name: 'Prof. Reyes' },

  { subject: 'IT 311',     title: 'Systems Analysis & Design',       section: 'BSIT 3-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CB 401',  building: 'CB', instructor_name: 'Prof. Villanueva' },
  { subject: 'IT 421',     title: 'Capstone Project 1',              section: 'BSIT 4-A', days: ['M','TH'], start_time: '17:30:00', end_time: '19:00:00', room: 'CB 402',  building: 'CB', instructor_name: 'Prof. Villanueva' },
  { subject: 'IT 422',     title: 'Capstone Project 2',              section: 'BSIT 4-B', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CB 402',  building: 'CB', instructor_name: 'Prof. Villanueva' },

  // Ground Floor — rooms 105–118
  { subject: 'CC 111',     title: 'Web Development 1',               section: 'BSIT 1-C', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 105',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CC 112',     title: 'Logic Design',                    section: 'BSCS 1-A', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CB 106',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'CC 113',     title: 'Digital Principles',              section: 'BSCS 1-B', days: ['M','W','F'], start_time: '08:00:00', end_time: '09:00:00', room: 'CB 107',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 118',     title: 'Computer Architecture',           section: 'BSCS 1-C', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 108',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 119',     title: 'OS Concepts',                     section: 'BSIT 2-D', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CB 109',  building: 'CB', instructor_name: 'Prof. Espinosa' },
  { subject: 'IT 114',     title: 'Digital Systems',                 section: 'BSIT 1-D', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 110',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CC 114',     title: 'Multimedia Systems',              section: 'BSIT 2-D', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CB 111',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 211',     title: 'Java Programming',                section: 'BSIT 2-A', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CB 112',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 223',     title: 'Web Systems Lab',                 section: 'BSIT 3-C', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 113',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 224',     title: 'Mobile Dev Lab',                  section: 'BSIT 3-D', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CB 114',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 412',     title: 'Cloud Infrastructure',            section: 'BSIT 4-B', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CB 115',  building: 'CB', instructor_name: 'Prof. Espinosa' },
  { subject: 'CC 116',     title: 'Digital Logic Lab',               section: 'BSIT 1-D', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CB 116',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'IT 317',     title: 'IoT Systems',                     section: 'BSIT 3-C', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CB 117',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 418',     title: 'Big Data Analytics',              section: 'BSIT 4-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CB 118',  building: 'CB', instructor_name: 'Prof. Tan' },

  // 2nd Floor — rooms 201–218
  { subject: 'IT 219',     title: 'Data Comm Lab',                   section: 'BSIT 2-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 201',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 214',     title: 'Network Protocols Lab',           section: 'BSIT 3-C', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CB 204',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 211',     title: 'Algorithm Design',                section: 'BSCS 2-A', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CB 205',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 225',     title: 'Software Testing',                section: 'BSIT 3-D', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 206',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 218',     title: 'UI/UX Principles',                section: 'BSIT 2-C', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CB 207',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 312',     title: 'IT Project Management',           section: 'BSIT 4-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CB 208',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 313',     title: 'Cybersecurity Fundamentals',      section: 'BSIT 4-B', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 209',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 213',     title: 'Database Systems',                section: 'BSCS 2-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CB 210',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 413',     title: 'Enterprise Computing',            section: 'BSIT 4-C', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CB 211',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 314',     title: 'Software Architecture',           section: 'BSIT 3-D', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CB 212',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 315',     title: 'DevOps Engineering',              section: 'BSIT 4-C', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CB 213',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 414',     title: 'Machine Learning',                section: 'BSIT 4-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CB 214',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'IT 316',     title: 'Thesis Writing 1',                section: 'BSIT 4-D', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CB 215',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 415',     title: 'Cloud Computing Advanced',        section: 'BSIT 4-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CB 216',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 318',     title: 'Tech Entrepreneurship',           section: 'BSIT 3-C', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CB 217',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 416',     title: 'AI Systems',                      section: 'BSIT 4-A', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CB 218',  building: 'CB', instructor_name: 'Prof. Espinosa' },

  // 3rd Floor — rooms 303–318
  { subject: 'CS 301',     title: 'Theory of Computation',           section: 'BSCS 3-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 303',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 302',     title: 'Compiler Design',                 section: 'BSCS 3-A', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CB 304',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 319',     title: 'Mobile App Development',          section: 'BSIT 3-D', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CB 305',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'CS 303',     title: 'Computer Graphics',               section: 'BSCS 3-B', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 306',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 323',     title: 'Wireless Networks',               section: 'BSIT 3-C', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CB 307',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'CS 311',     title: 'Software Engineering Adv.',       section: 'BSCS 3-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CB 308',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'IT 324',     title: 'Embedded Systems',                section: 'BSIT 3-D', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 309',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'CS 312',     title: 'Parallel Computing',              section: 'BSCS 3-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CB 310',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'IT 325',     title: 'Web Application Security',        section: 'BSIT 4-A', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CB 311',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'CS 313',     title: 'AI Programming',                  section: 'BSCS 3-C', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CB 312',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 417',     title: 'Data Mining',                     section: 'BSIT 4-B', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CB 313',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 314',     title: 'Human-Computer Interaction Adv.', section: 'BSCS 3-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CB 314',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 419',     title: 'Blockchain Technology',           section: 'BSIT 4-B', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CB 315',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'CS 315',     title: 'Distributed Systems',             section: 'BSCS 3-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CB 316',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'IT 420',     title: 'NLP Fundamentals',                section: 'BSIT 4-A', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CB 317',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'CS 316',     title: 'Network Security Advanced',       section: 'BSCS 4-A', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CB 318',  building: 'CB', instructor_name: 'Prof. Lim' },

  // 4th Floor — rooms 403–418
  { subject: 'CS 401',     title: 'Advanced Algorithms',             section: 'BSCS 4-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CB 403',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 423',     title: 'Capstone Research 1',             section: 'BSIT 4-C', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CB 404',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'CS 402',     title: 'Software Process',                section: 'BSCS 4-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CB 405',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'CS 403',     title: 'Advanced Database',               section: 'BSCS 4-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CB 406',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'IT 424',     title: 'Tech Research Methods',           section: 'BSIT 4-D', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CB 407',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 404',     title: 'Machine Learning Advanced',       section: 'BSCS 4-B', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CB 408',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 425',     title: 'Industry Practicum',              section: 'BSIT 4-D', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CB 409',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'CS 411',     title: 'Computer Vision',                 section: 'BSCS 4-C', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CB 410',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'CS 412',     title: 'Deep Learning',                   section: 'BSCS 4-C', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CB 411',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'CS 413',     title: 'Thesis Seminar 1',                section: 'BSCS 4-D', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CB 412',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 414',     title: 'Thesis Seminar 2',                section: 'BSCS 4-D', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CB 413',  building: 'CB', instructor_name: 'Prof. Tan' },
  { subject: 'IT 426',     title: 'Internship Preparation',          section: 'BSIT 4-A', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CB 414',  building: 'CB', instructor_name: 'Prof. Cruz' },
  { subject: 'CS 415',     title: 'Ethics in Computing',             section: 'BSCS 4-A', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CB 415',  building: 'CB', instructor_name: 'Prof. Alcantara' },
  { subject: 'CS 416',     title: 'IT Governance',                   section: 'BSCS 4-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CB 416',  building: 'CB', instructor_name: 'Prof. Buenaflor' },
  { subject: 'CS 417',     title: 'Special Topics in AI',            section: 'BSCS 4-C', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CB 417',  building: 'CB', instructor_name: 'Prof. Lim' },
  { subject: 'CS 418',     title: 'Graduate Research Intro',         section: 'BSCS 4-D', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CB 418',  building: 'CB', instructor_name: 'Prof. Tan' },

  // ── CBS ── College of Business Studies ──────────────────────────────────────

  // Existing instructors
  { subject: 'IC-RES 130', title: 'Elements of Research',            section: 'BSIT 3-B', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 102', building: 'CBS', instructor_name: 'Prof. Anoc' },
  { subject: 'IT 216',     title: 'Software Engineering',            section: 'BSIT 2-C', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBS 104', building: 'CBS', instructor_name: 'Prof. Anoc' },

  { subject: 'BA 101',     title: 'Principles of Management',        section: 'BSBA 1-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 101', building: 'CBS', instructor_name: 'Prof. Bautista' },
  { subject: 'BA 201',     title: 'Business Law',                    section: 'BSBA 2-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 101', building: 'CBS', instructor_name: 'Prof. Bautista' },
  { subject: 'BA 301',     title: 'Strategic Management',            section: 'BSBA 3-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 103', building: 'CBS', instructor_name: 'Prof. Bautista' },

  { subject: 'ACCT 101',   title: 'Financial Accounting 1',          section: 'BSBA 1-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 102', building: 'CBS', instructor_name: 'Prof. Flores' },
  { subject: 'ACCT 201',   title: 'Financial Accounting 2',          section: 'BSBA 2-B', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 201', building: 'CBS', instructor_name: 'Prof. Flores' },
  { subject: 'ACCT 301',   title: 'Managerial Accounting',           section: 'BSBA 3-B', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 201', building: 'CBS', instructor_name: 'Prof. Flores' },

  { subject: 'FIN 101',    title: 'Business Finance',                section: 'BSBA 2-A', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 202', building: 'CBS', instructor_name: 'Prof. Garcia' },
  { subject: 'ECON 101',   title: 'Microeconomics',                  section: 'BSBA 1-A', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 202', building: 'CBS', instructor_name: 'Prof. Garcia' },
  { subject: 'FIN 201',    title: 'Investment Management',           section: 'BSBA 3-A', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 301', building: 'CBS', instructor_name: 'Prof. Garcia' },

  { subject: 'MKT 101',    title: 'Principles of Marketing',         section: 'BSBA 1-B', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 103', building: 'CBS', instructor_name: 'Prof. Mendoza' },
  { subject: 'MKT 201',    title: 'Consumer Behavior',               section: 'BSBA 2-B', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 301', building: 'CBS', instructor_name: 'Prof. Mendoza' },
  { subject: 'MKT 301',    title: 'Digital Marketing',               section: 'BSBA 3-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 302', building: 'CBS', instructor_name: 'Prof. Mendoza' },

  { subject: 'MGT 201',    title: 'Operations Management',           section: 'BSBA 2-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 302', building: 'CBS', instructor_name: 'Prof. Torres' },
  { subject: 'HRM 101',    title: 'Introduction to HRM',             section: 'BSBA 1-A', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBS 401', building: 'CBS', instructor_name: 'Prof. Torres' },

  // GF — rooms 105–118
  { subject: 'BA 111',     title: 'Business Statistics',             section: 'BSBA 1-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 105', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 111',   title: 'Accounting Principles',           section: 'BSBA 1-C', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 106', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 111',   title: 'Macroeconomics',                  section: 'BSBA 1-A', days: ['M','W','F'], start_time: '08:00:00', end_time: '09:00:00', room: 'CBS 107', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 111',    title: 'Organizational Behavior',         section: 'BSBA 1-C', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 108', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'BA 121',     title: 'Business Communication',          section: 'BSBA 1-D', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 109', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 121',   title: 'Cost Accounting',                 section: 'BSBA 2-C', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 110', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 121',   title: 'Business Economics',              section: 'BSBA 2-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBS 111', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 121',    title: 'Human Resource Management',       section: 'BSBA 2-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 112', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 111',    title: 'Sales Management',                section: 'BSBA 2-D', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 113', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 131',   title: 'Auditing 1',                      section: 'BSBA 3-C', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 114', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'FIN 121',    title: 'Corporate Finance',               section: 'BSBA 3-A', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 115', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 131',    title: 'Strategic HR',                    section: 'BSBA 3-D', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBS 116', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 121',    title: 'Brand Management',                section: 'BSBA 3-C', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 117', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 141',   title: 'Taxation',                        section: 'BSBA 4-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 118', building: 'CBS', instructor_name: 'Prof. Campos' },

  // 2nd Floor — rooms 203–218
  { subject: 'ECON 201',   title: "Int'l Trade",                     section: 'BSBA 2-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 203', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 211',    title: 'Supply Chain Management',         section: 'BSBA 3-A', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 204', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 211',    title: 'Financial Modeling',              section: 'BSBA 3-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 205', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 211',   title: "Int'l Accounting",                section: 'BSBA 3-C', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 206', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 211',   title: 'Development Economics',           section: 'BSBA 3-D', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBS 207', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 221',    title: 'Knowledge Management',            section: 'BSBA 4-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 208', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 211',    title: 'E-Commerce',                      section: 'BSBA 3-B', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 209', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 221',   title: 'Forensic Accounting',             section: 'BSBA 4-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBS 210', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 221',   title: 'Monetary Economics',              section: 'BSBA 4-A', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 211', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 231',    title: 'Change Management',               section: 'BSBA 4-B', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 212', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 221',    title: 'Risk Management',                 section: 'BSBA 4-A', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBS 213', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 231',   title: 'Govt & NGO Accounting',           section: 'BSBA 4-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 214', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 231',   title: 'Environmental Economics',         section: 'BSBA 4-B', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 215', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 241',    title: 'Business Research',               section: 'BSBA 4-C', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 216', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 221',    title: 'Social Media Marketing',          section: 'BSBA 3-D', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBS 217', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 241',   title: 'Seminar in Accounting',           section: 'BSBA 4-D', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBS 218', building: 'CBS', instructor_name: 'Prof. Campos' },

  // 3rd Floor — rooms 303–318
  { subject: 'ECON 301',   title: 'Econometrics',                    section: 'BSBA 3-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 303', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 301',    title: 'Total Quality Management',        section: 'BSBA 3-B', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 304', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 301',    title: 'Portfolio Management',            section: 'BSBA 3-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 305', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 311',   title: 'Advanced Accounting',             section: 'BSBA 3-D', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 306', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 311',   title: 'Public Economics',                section: 'BSBA 4-A', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBS 307', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 311',    title: 'International Business',          section: 'BSBA 3-C', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 308', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 311',    title: 'Derivatives & Options',           section: 'BSBA 4-A', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 309', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 321',   title: 'Business Taxation',               section: 'BSBA 4-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBS 310', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 321',   title: 'Labor Economics',                 section: 'BSBA 4-B', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 311', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 321',    title: 'Entrepreneurship',                section: 'BSBA 3-D', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 312', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 321',    title: 'Real Estate Finance',             section: 'BSBA 4-C', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBS 313', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 331',   title: 'IT in Accounting',                section: 'BSBA 4-A', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 314', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 331',   title: 'Economic Policy',                 section: 'BSBA 4-C', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 315', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 331',    title: 'Business Ethics',                 section: 'BSBA 4-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 316', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 311',    title: 'Advertising Management',          section: 'BSBA 3-B', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBS 317', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 341',   title: 'Capstone in Accounting',          section: 'BSBA 4-D', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 318', building: 'CBS', instructor_name: 'Prof. Campos' },

  // 4th Floor — rooms 402–418
  { subject: 'ECON 401',   title: 'Applied Econometrics',            section: 'BSBA 4-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 402', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 401',    title: 'Strategic Planning',              section: 'BSBA 4-A', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBS 403', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 401',    title: 'Corporate Strategy',              section: 'BSBA 4-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 404', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 401',   title: 'Financial Reporting Standards',   section: 'BSBA 4-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBS 405', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 411',   title: 'Global Economics',                section: 'BSBA 4-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBS 406', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 411',    title: 'Organizational Leadership',       section: 'BSBA 4-C', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 407', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 411',    title: 'Investment Banking',              section: 'BSBA 4-C', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBS 408', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 411',   title: 'Seminar in Auditing',             section: 'BSBA 4-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBS 409', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 421',   title: 'Economic Development',            section: 'BSBA 4-D', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 410', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 421',    title: 'Business Simulation',             section: 'BSBA 4-D', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBS 411', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'FIN 421',    title: 'Hedge Fund Analysis',             section: 'BSBA 4-D', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBS 412', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 421',   title: 'External Audit',                  section: 'BSBA 4-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 413', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 431',   title: "Int'l Finance",                   section: 'BSBA 4-C', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBS 414', building: 'CBS', instructor_name: 'Prof. Soriano' },
  { subject: 'MGT 431',    title: 'Thesis in Management',            section: 'BSBA 4-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 415', building: 'CBS', instructor_name: 'Prof. Valenzuela' },
  { subject: 'MKT 401',    title: 'Marketing Research',              section: 'BSBA 4-A', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBS 416', building: 'CBS', instructor_name: 'Prof. Rivera' },
  { subject: 'ACCT 431',   title: 'Accounting Thesis',               section: 'BSBA 4-D', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBS 417', building: 'CBS', instructor_name: 'Prof. Campos' },
  { subject: 'ECON 441',   title: 'Independent Study in Econ',       section: 'BSBA 4-D', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBS 418', building: 'CBS', instructor_name: 'Prof. Soriano' },

  // ── CBE ── College of Business Education ────────────────────────────────────

  // Existing instructors
  { subject: 'IT 383-EL4', title: 'Web Systems & Technologies',      section: 'BSED 3-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 201', building: 'CBE', instructor_name: 'Prof. Anoc' },
  { subject: 'IT 217',     title: 'Human-Computer Interaction',      section: 'BSED 2-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBE 104', building: 'CBE', instructor_name: 'Prof. Anoc' },

  { subject: 'EDUC 101',   title: 'Principles of Teaching 1',        section: 'BSED 1-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 101', building: 'CBE', instructor_name: 'Prof. Castro' },
  { subject: 'EDUC 201',   title: 'Principles of Teaching 2',        section: 'BSED 2-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 101', building: 'CBE', instructor_name: 'Prof. Castro' },
  { subject: 'EDUC 301',   title: 'Curriculum Development',          section: 'BSED 3-A', days: ['M','W','F'], start_time: '12:00:00', end_time: '13:00:00', room: 'CBE 102', building: 'CBE', instructor_name: 'Prof. Castro' },

  { subject: 'HRM 201',    title: 'Food & Beverage Service',         section: 'BSHRM 2-A', days: ['T','F'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 102', building: 'CBE', instructor_name: 'Prof. Aquino' },
  { subject: 'HRM 301',    title: 'Front Office Operations',         section: 'BSHRM 3-A', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 201', building: 'CBE', instructor_name: 'Prof. Aquino' },
  { subject: 'HRM 401',    title: 'Event Management',                section: 'BSHRM 4-A', days: ['T','F'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 202', building: 'CBE', instructor_name: 'Prof. Aquino' },

  { subject: 'TOUR 101',   title: 'Introduction to Tourism',         section: 'BSTM 1-A', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 202', building: 'CBE', instructor_name: 'Prof. Ramos' },
  { subject: 'TOUR 201',   title: 'Tour Guiding Services',           section: 'BSTM 2-A', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 203', building: 'CBE', instructor_name: 'Prof. Ramos' },
  { subject: 'TOUR 301',   title: 'Sustainable Tourism',             section: 'BSTM 3-A', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 203', building: 'CBE', instructor_name: 'Prof. Ramos' },

  { subject: 'GE 101',     title: 'Purposive Communication',         section: 'BSED 1-B', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 301', building: 'CBE', instructor_name: 'Prof. Fernandez' },
  { subject: 'GE 102',     title: 'Readings in Philippine History',  section: 'BSHRM 1-A', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 301', building: 'CBE', instructor_name: 'Prof. Fernandez' },
  { subject: 'GE 103',     title: 'The Contemporary World',          section: 'BSTM 2-B', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBE 302', building: 'CBE', instructor_name: 'Prof. Fernandez' },

  { subject: 'PE 101',     title: 'Physical Fitness',                section: 'BSED 1-A', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 401', building: 'CBE', instructor_name: 'Prof. Navarro' },
  { subject: 'PE 102',     title: 'Rhythmic Activities',             section: 'BSHRM 1-A', days: ['M','TH'], start_time: '17:30:00', end_time: '19:00:00', room: 'CBE 401', building: 'CBE', instructor_name: 'Prof. Navarro' },

  // GF — rooms 105–118
  { subject: 'EDUC 111',   title: 'Child Dev & Learning',            section: 'BSED 1-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 105', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 111',   title: 'Travel & Tourism Intro',          section: 'BSTM 1-B', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 106', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 111',    title: 'Hospitality Principles',          section: 'BSHRM 1-B', days: ['M','W','F'], start_time: '08:00:00', end_time: '09:00:00', room: 'CBE 107', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 111',     title: 'Sports Science',                  section: 'BSED 1-C', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 108', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 121',   title: 'Facilitating Learning',           section: 'BSED 1-C', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 109', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 121',   title: 'Cultural Tourism',                section: 'BSTM 1-B', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 110', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 121',    title: 'Front Desk Operations',           section: 'BSHRM 1-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBE 111', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 121',     title: 'Health & Fitness',                section: 'BSED 2-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 112', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 211',   title: 'Special Education',               section: 'BSED 2-C', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 113', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 211',   title: 'Eco-Tourism',                     section: 'BSTM 2-B', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 114', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 211',    title: 'Housekeeping Operations',         section: 'BSHRM 2-B', days: ['T','F'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 115', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 131',     title: 'Team Sports',                     section: 'BSED 1-D', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBE 116', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 221',   title: 'Curriculum Design',               section: 'BSED 3-B', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 117', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 221',   title: 'Resort Management',               section: 'BSTM 2-B', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 118', building: 'CBE', instructor_name: 'Prof. Santiago' },

  // 2nd Floor — rooms 204–218
  { subject: 'HRM 221',    title: 'F&B Operations',                  section: 'BSHRM 2-B', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 204', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 201',     title: 'Outdoor Recreation',              section: 'BSED 2-D', days: ['T','F'],  start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 205', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 311',   title: 'Assessment & Evaluation',         section: 'BSED 3-B', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 206', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 311',   title: 'Tourism Policy',                  section: 'BSTM 3-B', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 207', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 311',    title: 'Event Planning',                  section: 'BSHRM 3-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBE 208', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 211',     title: 'Dance & Rhythmics',               section: 'BSED 2-C', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 209', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 321',   title: 'Educational Technology',          section: 'BSED 3-D', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBE 210', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 321',   title: 'Destination Management',          section: 'BSTM 3-B', days: ['T','F'],  start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 211', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 321',    title: 'Banquet Operations',              section: 'BSHRM 3-B', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 212', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 221',     title: 'Water Sports',                    section: 'BSED 3-C', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBE 213', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'NSTP 101',   title: 'Civic Welfare Training 1',        section: 'BSED 1-A', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 214', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 331',   title: 'Tourism Research',                section: 'BSTM 4-A', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 215', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 331',    title: 'Hotel Management',                section: 'BSHRM 3-C', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 216', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 231',     title: 'Racket Sports',                   section: 'BSED 2-D', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBE 217', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'NSTP 201',   title: 'Literacy Training Service',       section: 'BSED 1-B', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBE 218', building: 'CBE', instructor_name: 'Prof. Domingo' },

  // 3rd Floor — rooms 303–318
  { subject: 'TOUR 401',   title: "Int'l Tourism Management",        section: 'BSTM 4-A', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 303', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 411',    title: 'Hotel Law & Ethics',              section: 'BSHRM 4-A', days: ['T','F'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 304', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 301',     title: 'Exercise Physiology',             section: 'BSED 3-D', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 305', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 401',   title: 'Teaching Practicum',              section: 'BSED 4-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 306', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 411',   title: 'Tourism Practicum',               section: 'BSTM 4-B', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBE 307', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 421',    title: 'Food Production',                 section: 'BSHRM 4-B', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 308', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 311',     title: 'Sports Psychology',               section: 'BSED 4-A', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 309', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 411',   title: 'Educational Leadership',          section: 'BSED 4-B', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBE 310', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'GE 211',     title: 'Contemporary Literature',         section: 'BSTM 2-A', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 311', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 431',    title: 'Tourism Operations',              section: 'BSHRM 4-C', days: ['T','F'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 312', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 321',     title: 'Coaching & Officiating',          section: 'BSED 4-B', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBE 313', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 421',   title: 'Community Engagement',            section: 'BSED 4-C', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 314', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 421',   title: 'Thesis in Tourism',               section: 'BSTM 4-C', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 315', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 441',    title: 'Capstone in HRM',                 section: 'BSHRM 4-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 316', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 331',     title: 'Sports Nutrition',                section: 'BSED 3-C', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBE 317', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 431',   title: 'Thesis Seminar',                  section: 'BSED 4-D', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 318', building: 'CBE', instructor_name: 'Prof. Domingo' },

  // 4th Floor — rooms 402–418
  { subject: 'TOUR 431',   title: 'Sustainable Tourism Dev',         section: 'BSTM 4-D', days: ['M','TH'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 402', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 451',    title: 'Research in Hospitality',         section: 'BSHRM 4-D', days: ['T','F'], start_time: '07:30:00', end_time: '09:00:00', room: 'CBE 403', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 401',     title: 'Sports Administration',           section: 'BSED 4-C', days: ['M','TH'], start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 404', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 441',   title: 'Assessment Methods',              section: 'BSED 4-A', days: ['T','F'],  start_time: '09:00:00', end_time: '10:30:00', room: 'CBE 405', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'GE 221',     title: 'Science, Tech & Society',         section: 'BSTM 1-A', days: ['M','W','F'], start_time: '10:00:00', end_time: '11:00:00', room: 'CBE 406', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 461',    title: "Int'l Hospitality",               section: 'BSHRM 4-D', days: ['M','TH'], start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 407', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 411',     title: 'Fitness Instruction',             section: 'BSED 4-D', days: ['T','F'],  start_time: '10:30:00', end_time: '12:00:00', room: 'CBE 408', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 451',   title: 'Research Writing',                section: 'BSED 4-D', days: ['M','W','F'], start_time: '11:00:00', end_time: '12:00:00', room: 'CBE 409', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 441',   title: 'Cultural Heritage Management',    section: 'BSTM 4-D', days: ['M','TH'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 410', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 471',    title: 'Thesis in Hospitality',           section: 'BSHRM 4-D', days: ['T','F'], start_time: '12:00:00', end_time: '13:30:00', room: 'CBE 411', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 421',     title: 'Recreation Therapy',              section: 'BSED 4-C', days: ['M','W','F'], start_time: '13:00:00', end_time: '14:00:00', room: 'CBE 412', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 461',   title: 'Seminar in Education',            section: 'BSED 4-D', days: ['M','TH'], start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 413', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 451',   title: 'Industry Practicum',              section: 'BSTM 4-D', days: ['T','F'],  start_time: '13:30:00', end_time: '15:00:00', room: 'CBE 414', building: 'CBE', instructor_name: 'Prof. Santiago' },
  { subject: 'HRM 481',    title: 'Hospitality Seminar',             section: 'BSHRM 4-D', days: ['M','TH'], start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 415', building: 'CBE', instructor_name: 'Prof. Macaraeg' },
  { subject: 'PE 431',     title: 'Adaptive Sports',                 section: 'BSED 4-D', days: ['T','F'],  start_time: '15:00:00', end_time: '16:30:00', room: 'CBE 416', building: 'CBE', instructor_name: 'Prof. Tolentino' },
  { subject: 'EDUC 471',   title: 'Teaching Internship',             section: 'BSED 4-D', days: ['M','W','F'], start_time: '14:00:00', end_time: '15:00:00', room: 'CBE 417', building: 'CBE', instructor_name: 'Prof. Domingo' },
  { subject: 'TOUR 461',   title: 'Seminar in Tourism',              section: 'BSTM 4-D', days: ['T','F'],  start_time: '17:30:00', end_time: '19:00:00', room: 'CBE 418', building: 'CBE', instructor_name: 'Prof. Santiago' },
]

async function run() {
  console.log('Clearing schedule_entries...')
  const { error: delError } = await db.from('schedule_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delError) { console.error('Delete failed:', delError.message); process.exit(1) }

  console.log(`Inserting ${ENTRIES.length} entries in batches...`)
  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < ENTRIES.length; i += BATCH) {
    const batch = ENTRIES.slice(i, i + BATCH)
    const { error } = await db.from('schedule_entries').insert(batch)
    if (error) { console.error(`Batch ${i}–${i + BATCH} failed:`, error.message); process.exit(1) }
    inserted += batch.length
    console.log(`  ✓ ${inserted}/${ENTRIES.length}`)
  }

  console.log(`\nDone. ${inserted} schedule entries inserted across CB, CBS, CBE.`)
  console.log('Rooms covered per floor: ~18 × 4 floors × 3 buildings')
}

run().catch(console.error)
