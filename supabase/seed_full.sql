-- ============================================================
-- FULL DEMO SEED — paste this entire block into Supabase SQL Editor
-- ============================================================
-- Fills every room in CB, CBS, CBE (rooms 101–118 on GF–4F)
-- with 7 classes per day, Mon–Fri, morning through evening.
-- 3 day patterns per room:
--   Mon/Thu  — 7 × 1.5-hr slots (07:30 → 19:00)
--   Tue/Fri  — 7 × 1.5-hr slots (07:30 → 19:00)
--   Wed only — 7 × 1.5-hr slots (07:30 → 19:00)
-- Total: 18 rooms × 4 floors × 3 buildings × 21 entries = 4,536 rows
-- ============================================================

DO $$
DECLARE
  bldg TEXT;
  b    INT; f    INT; r    INT; dp   INT; s INT;
  room_name  TEXT;
  instr_idx  INT;
  subj_idx   INT;
  sect_idx   INT;
  subj_num   INT;
  cur_instrs TEXT[];
  cur_sp     TEXT[];
  cur_st     TEXT[];
  cur_sec    TEXT[][];
  cur_days   TEXT[];

  -- 1.5-hour slot boundaries (same grid for all 3 day patterns)
  ts TIME[] := ARRAY[
    '07:30'::TIME,'09:00'::TIME,'10:30'::TIME,'12:00'::TIME,
    '13:30'::TIME,'15:00'::TIME,'17:30'::TIME
  ];
  te TIME[] := ARRAY[
    '09:00'::TIME,'10:30'::TIME,'12:00'::TIME,'13:30'::TIME,
    '15:00'::TIME,'16:30'::TIME,'19:00'::TIME
  ];

  -- ── Instructors ─────────────────────────────────────────────
  cb_i  TEXT[] := ARRAY[
    'Prof. Anoc','Prof. Dela Cruz','Prof. Santos','Prof. Reyes','Prof. Villanueva',
    'Prof. Lim','Prof. Tan','Prof. Cruz','Prof. Alcantara','Prof. Buenaflor'
  ];
  cbs_i TEXT[] := ARRAY[
    'Prof. Bautista','Prof. Flores','Prof. Garcia','Prof. Mendoza','Prof. Torres',
    'Prof. Rivera','Prof. Campos','Prof. Soriano','Prof. Valenzuela','Prof. Anoc'
  ];
  cbe_i TEXT[] := ARRAY[
    'Prof. Castro','Prof. Aquino','Prof. Ramos','Prof. Fernandez','Prof. Navarro',
    'Prof. Domingo','Prof. Santiago','Prof. Macaraeg','Prof. Tolentino','Prof. Anoc'
  ];

  -- ── Subject code prefixes (14, cycle) ───────────────────────
  cb_sp  TEXT[] := ARRAY['CC','IT','IT','CS','IT','CS','IT','IT','IT','IT','CS','IT','IT','CS'];
  cbs_sp TEXT[] := ARRAY['BA','ACCT','FIN','MGT','MKT','ECON','BA','ACCT','FIN','MGT','MKT','ECON','BA','ACCT'];
  cbe_sp TEXT[] := ARRAY['EDUC','TOUR','HRM','PE','EDUC','TOUR','HRM','GE','NSTP','EDUC','TOUR','HRM','PE','GE'];

  -- ── Subject titles (14, cycle — aligned with prefixes) ──────
  cb_st  TEXT[] := ARRAY[
    'Programming Fundamentals','Data Structures & Algorithms','Object-Oriented Programming',
    'Discrete Mathematics','Database Systems','Computer Architecture','Operating Systems',
    'Computer Networks','Web Development','Mobile Development','Software Engineering',
    'Information Security','Cloud Computing','Machine Learning'
  ];
  cbs_st TEXT[] := ARRAY[
    'Principles of Management','Financial Accounting','Business Finance',
    'Operations Management','Marketing Management','Microeconomics',
    'Business Law','Cost Accounting','Investment Management','Strategic Management',
    'Consumer Behavior','Macroeconomics','Business Communication','Managerial Accounting'
  ];
  cbe_st TEXT[] := ARRAY[
    'Principles of Teaching','Introduction to Tourism','Hotel Management',
    'Physical Fitness','Curriculum Development','Tour Guiding Services',
    'Food & Beverage Service','Purposive Communication','Civic Welfare Training',
    'Assessment & Evaluation','Sustainable Tourism','Front Office Operations',
    'Rhythmic Activities','The Contemporary World'
  ];

  -- ── Sections per floor (6 options, cycle) ───────────────────
  cb_sec TEXT[][] := ARRAY[
    ARRAY['BSIT 1-A','BSIT 1-B','BSIT 1-C','BSCS 1-A','BSCS 1-B','BSIT 1-D'],
    ARRAY['BSIT 2-A','BSIT 2-B','BSIT 2-C','BSCS 2-A','BSCS 2-B','BSIT 2-D'],
    ARRAY['BSIT 3-A','BSIT 3-B','BSIT 3-C','BSCS 3-A','BSCS 3-B','BSIT 3-D'],
    ARRAY['BSIT 4-A','BSIT 4-B','BSIT 4-C','BSCS 4-A','BSCS 4-B','BSIT 4-D']
  ];
  cbs_sec TEXT[][] := ARRAY[
    ARRAY['BSBA 1-A','BSBA 1-B','BSBA 1-C','BSA 1-A','BSA 1-B','BSBA 1-D'],
    ARRAY['BSBA 2-A','BSBA 2-B','BSBA 2-C','BSA 2-A','BSA 2-B','BSBA 2-D'],
    ARRAY['BSBA 3-A','BSBA 3-B','BSBA 3-C','BSA 3-A','BSA 3-B','BSBA 3-D'],
    ARRAY['BSBA 4-A','BSBA 4-B','BSBA 4-C','BSA 4-A','BSA 4-B','BSBA 4-D']
  ];
  cbe_sec TEXT[][] := ARRAY[
    ARRAY['BSED 1-A','BSED 1-B','BSTM 1-A','BSTM 1-B','BSHRM 1-A','BSHRM 1-B'],
    ARRAY['BSED 2-A','BSED 2-B','BSTM 2-A','BSTM 2-B','BSHRM 2-A','BSHRM 2-B'],
    ARRAY['BSED 3-A','BSED 3-B','BSTM 3-A','BSTM 3-B','BSHRM 3-A','BSHRM 3-B'],
    ARRAY['BSED 4-A','BSED 4-B','BSTM 4-A','BSTM 4-B','BSHRM 4-A','BSHRM 4-B']
  ];

BEGIN
  TRUNCATE TABLE public.schedule_entries;

  FOR b IN 1..3 LOOP
    CASE b
      WHEN 1 THEN bldg:='CB';  cur_instrs:=cb_i;  cur_sp:=cb_sp;  cur_st:=cb_st;  cur_sec:=cb_sec;
      WHEN 2 THEN bldg:='CBS'; cur_instrs:=cbs_i; cur_sp:=cbs_sp; cur_st:=cbs_st; cur_sec:=cbs_sec;
      ELSE        bldg:='CBE'; cur_instrs:=cbe_i; cur_sp:=cbe_sp; cur_st:=cbe_st; cur_sec:=cbe_sec;
    END CASE;

    FOR f IN 1..4 LOOP
      FOR r IN 1..18 LOOP
        room_name := bldg || ' ' || (f * 100 + r);

        -- 3 day patterns: Mon/Thu · Tue/Fri · Wed-only
        FOR dp IN 1..3 LOOP
          CASE dp
            WHEN 1 THEN cur_days := ARRAY['M','TH'];
            WHEN 2 THEN cur_days := ARRAY['T','F'];
            ELSE        cur_days := ARRAY['W'];
          END CASE;

          -- 7 slots covering 07:30–19:00
          FOR s IN 1..7 LOOP
            -- Cycle formulae — vary by room, slot, and day-pattern so
            -- neighbouring rooms get different instructors/subjects.
            instr_idx := ((r + s + dp - 2) % 10) + 1;
            subj_idx  := ((r + s + dp - 3) % 14) + 1;
            sect_idx  := ((s + r + dp - 3) %  6) + 1;
            subj_num  := f * 100 + ((r * 3 + s * 7 + dp * 5 - 1) % 25) + 1;

            INSERT INTO public.schedule_entries
              (subject, title, section, days, start_time, end_time, room, building, instructor_name)
            VALUES (
              cur_sp[subj_idx] || ' ' || subj_num,
              cur_st[subj_idx],
              cur_sec[f][sect_idx],
              cur_days,
              ts[s],
              te[s],
              room_name,
              bldg,
              cur_instrs[instr_idx]
            );
          END LOOP; -- slot
        END LOOP; -- day pattern
      END LOOP; -- room
    END LOOP; -- floor
  END LOOP; -- building

  RAISE NOTICE 'Seed complete. Rows inserted: %',
    (SELECT COUNT(*) FROM public.schedule_entries);
END $$;