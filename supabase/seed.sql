-- Seed data for development / demo presentation
-- Re-runnable: TRUNCATE clears existing entries each time
-- Buildings: CB (Computer Studies), CBS (Business Studies), CBE (Business Education)

TRUNCATE TABLE public.schedule_entries;

INSERT INTO public.schedule_entries
  (subject, title, section, days, start_time, end_time, room, building, instructor_name)
VALUES

-- ==================================================
-- CB BUILDING — College of Computer Studies
-- ==================================================

-- === CB Ground Floor (101–118) ===

-- Existing instructors
('IT 381',     'Application Development',         'BSIT 3-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CB 202',  'CB', 'Prof. Anoc'),
('IT 380',     'Fundamentals of Database',         'BSIT 3-B',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 203',  'CB', 'Prof. Anoc'),
('IT 382',     'Systems Administration',           'BSIT 3-A',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CB 301',  'CB', 'Prof. Anoc'),
('IT 215',     'Data Communications',              'BSIT 2-C',   ARRAY['M','W','F'], '09:00:00', '10:00:00', 'CB 104',  'CB', 'Prof. Anoc'),

('CC 101',     'Introduction to Computing',        'BSIT 1-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 101',  'CB', 'Prof. Dela Cruz'),
('CC 102',     'Computer Programming 1',           'BSIT 1-B',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CB 101',  'CB', 'Prof. Dela Cruz'),
('CC 103',     'Computer Programming 2',           'BSIT 1-A',   ARRAY['M','W','F'], '12:00:00', '13:00:00', 'CB 102',  'CB', 'Prof. Dela Cruz'),

('IT 213',     'Discrete Mathematics',             'BSIT 2-A',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 102',  'CB', 'Prof. Santos'),
('IT 212',     'Object-Oriented Programming',      'BSIT 2-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CB 202',  'CB', 'Prof. Santos'),
('CC 104',     'Data Structures & Algorithms',     'BSIT 2-A',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CB 103',  'CB', 'Prof. Santos'),

('IT 321',     'Computer Networks',                'BSIT 3-B',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 301',  'CB', 'Prof. Reyes'),
('IT 322',     'Information Security',             'BSIT 3-A',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 302',  'CB', 'Prof. Reyes'),
('IT 411',     'Network Administration',           'BSIT 4-A',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CB 401',  'CB', 'Prof. Reyes'),

('IT 311',     'Systems Analysis & Design',        'BSIT 3-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CB 401',  'CB', 'Prof. Villanueva'),
('IT 421',     'Capstone Project 1',               'BSIT 4-A',   ARRAY['M','TH'],    '17:30:00', '19:00:00', 'CB 402',  'CB', 'Prof. Villanueva'),
('IT 422',     'Capstone Project 2',               'BSIT 4-B',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CB 402',  'CB', 'Prof. Villanueva'),

-- New rooms 105–118 (GF)
('CC 111',     'Web Development 1',                'BSIT 1-C',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 105',  'CB', 'Prof. Lim'),
('CC 112',     'Logic Design',                     'BSCS 1-A',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CB 106',  'CB', 'Prof. Tan'),
('CC 113',     'Digital Principles',               'BSCS 1-B',   ARRAY['M','W','F'], '08:00:00', '09:00:00', 'CB 107',  'CB', 'Prof. Cruz'),
('IT 118',     'Computer Architecture',            'BSCS 1-C',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 108',  'CB', 'Prof. Alcantara'),
('IT 119',     'OS Concepts',                      'BSIT 2-D',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CB 109',  'CB', 'Prof. Espinosa'),
('IT 114',     'Digital Systems',                  'BSIT 1-D',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 110',  'CB', 'Prof. Lim'),
('CC 114',     'Multimedia Systems',               'BSIT 2-D',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CB 111',  'CB', 'Prof. Buenaflor'),
('IT 211',     'Java Programming',                 'BSIT 2-A',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CB 112',  'CB', 'Prof. Tan'),
('IT 223',     'Web Systems Lab',                  'BSIT 3-C',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 113',  'CB', 'Prof. Cruz'),
('IT 224',     'Mobile Dev Lab',                   'BSIT 3-D',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CB 114',  'CB', 'Prof. Alcantara'),
('IT 412',     'Cloud Infrastructure',             'BSIT 4-B',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CB 115',  'CB', 'Prof. Espinosa'),
('CC 116',     'Digital Logic Lab',                'BSIT 1-D',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CB 116',  'CB', 'Prof. Lim'),
('IT 317',     'IoT Systems',                      'BSIT 3-C',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CB 117',  'CB', 'Prof. Buenaflor'),
('IT 418',     'Big Data Analytics',               'BSIT 4-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CB 118',  'CB', 'Prof. Tan'),

-- === CB 2nd Floor (201–218) ===
('IT 219',     'Data Comm Lab',                    'BSIT 2-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 201',  'CB', 'Prof. Buenaflor'),
('IT 214',     'Network Protocols Lab',            'BSIT 3-C',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CB 204',  'CB', 'Prof. Lim'),
('CS 211',     'Algorithm Design',                 'BSCS 2-A',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CB 205',  'CB', 'Prof. Tan'),
('IT 225',     'Software Testing',                 'BSIT 3-D',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 206',  'CB', 'Prof. Cruz'),
('IT 218',     'UI/UX Principles',                 'BSIT 2-C',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CB 207',  'CB', 'Prof. Alcantara'),
('IT 312',     'IT Project Management',            'BSIT 4-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CB 208',  'CB', 'Prof. Buenaflor'),
('IT 313',     'Cybersecurity Fundamentals',       'BSIT 4-B',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 209',  'CB', 'Prof. Lim'),
('CS 213',     'Database Systems',                 'BSCS 2-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CB 210',  'CB', 'Prof. Tan'),
('IT 413',     'Enterprise Computing',             'BSIT 4-C',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CB 211',  'CB', 'Prof. Cruz'),
('IT 314',     'Software Architecture',            'BSIT 3-D',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CB 212',  'CB', 'Prof. Alcantara'),
('IT 315',     'DevOps Engineering',               'BSIT 4-C',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CB 213',  'CB', 'Prof. Buenaflor'),
('IT 414',     'Machine Learning',                 'BSIT 4-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CB 214',  'CB', 'Prof. Lim'),
('IT 316',     'Thesis Writing 1',                 'BSIT 4-D',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CB 215',  'CB', 'Prof. Tan'),
('IT 415',     'Cloud Computing Advanced',         'BSIT 4-D',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CB 216',  'CB', 'Prof. Cruz'),
('IT 318',     'Tech Entrepreneurship',            'BSIT 3-C',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CB 217',  'CB', 'Prof. Alcantara'),
('IT 416',     'AI Systems',                       'BSIT 4-A',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CB 218',  'CB', 'Prof. Espinosa'),

-- === CB 3rd Floor (303–318) ===
('CS 301',     'Theory of Computation',            'BSCS 3-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 303',  'CB', 'Prof. Lim'),
('CS 302',     'Compiler Design',                  'BSCS 3-A',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CB 304',  'CB', 'Prof. Tan'),
('IT 319',     'Mobile App Development',           'BSIT 3-D',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CB 305',  'CB', 'Prof. Cruz'),
('CS 303',     'Computer Graphics',                'BSCS 3-B',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 306',  'CB', 'Prof. Alcantara'),
('IT 323',     'Wireless Networks',                'BSIT 3-C',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CB 307',  'CB', 'Prof. Buenaflor'),
('CS 311',     'Software Engineering Adv.',        'BSCS 3-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CB 308',  'CB', 'Prof. Lim'),
('IT 324',     'Embedded Systems',                 'BSIT 3-D',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 309',  'CB', 'Prof. Tan'),
('CS 312',     'Parallel Computing',               'BSCS 3-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CB 310',  'CB', 'Prof. Cruz'),
('IT 325',     'Web Application Security',         'BSIT 4-A',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CB 311',  'CB', 'Prof. Alcantara'),
('CS 313',     'AI Programming',                   'BSCS 3-C',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CB 312',  'CB', 'Prof. Buenaflor'),
('IT 417',     'Data Mining',                      'BSIT 4-B',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CB 313',  'CB', 'Prof. Lim'),
('CS 314',     'Human-Computer Interaction Adv.',  'BSCS 3-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CB 314',  'CB', 'Prof. Tan'),
('IT 419',     'Blockchain Technology',            'BSIT 4-B',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CB 315',  'CB', 'Prof. Cruz'),
('CS 315',     'Distributed Systems',              'BSCS 3-D',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CB 316',  'CB', 'Prof. Alcantara'),
('IT 420',     'NLP Fundamentals',                 'BSIT 4-A',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CB 317',  'CB', 'Prof. Buenaflor'),
('CS 316',     'Network Security Adv.',            'BSCS 4-A',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CB 318',  'CB', 'Prof. Lim'),

-- === CB 4th Floor (403–418) ===
('CS 401',     'Advanced Algorithms',              'BSCS 4-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CB 403',  'CB', 'Prof. Tan'),
('IT 423',     'Capstone Research 1',              'BSIT 4-C',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CB 404',  'CB', 'Prof. Cruz'),
('CS 402',     'Software Process',                 'BSCS 4-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CB 405',  'CB', 'Prof. Alcantara'),
('CS 403',     'Advanced Database',                'BSCS 4-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CB 406',  'CB', 'Prof. Buenaflor'),
('IT 424',     'Tech Research Methods',            'BSIT 4-D',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CB 407',  'CB', 'Prof. Lim'),
('CS 404',     'Machine Learning Advanced',        'BSCS 4-B',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CB 408',  'CB', 'Prof. Tan'),
('IT 425',     'Industry Practicum',               'BSIT 4-D',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CB 409',  'CB', 'Prof. Cruz'),
('CS 411',     'Computer Vision',                  'BSCS 4-C',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CB 410',  'CB', 'Prof. Alcantara'),
('CS 412',     'Deep Learning',                    'BSCS 4-C',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CB 411',  'CB', 'Prof. Buenaflor'),
('CS 413',     'Thesis Seminar 1',                 'BSCS 4-D',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CB 412',  'CB', 'Prof. Lim'),
('CS 414',     'Thesis Seminar 2',                 'BSCS 4-D',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CB 413',  'CB', 'Prof. Tan'),
('IT 426',     'Internship Preparation',           'BSIT 4-A',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CB 414',  'CB', 'Prof. Cruz'),
('CS 415',     'Ethics in Computing',              'BSCS 4-A',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CB 415',  'CB', 'Prof. Alcantara'),
('CS 416',     'IT Governance',                    'BSCS 4-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CB 416',  'CB', 'Prof. Buenaflor'),
('CS 417',     'Special Topics in AI',             'BSCS 4-C',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CB 417',  'CB', 'Prof. Lim'),
('CS 418',     'Graduate Research Intro',          'BSCS 4-D',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CB 418',  'CB', 'Prof. Tan'),

-- ==================================================
-- CBS BUILDING — College of Business Studies
-- ==================================================

-- Existing instructors
('IC-RES 130', 'Elements of Research',             'BSIT 3-B',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBS 102', 'CBS', 'Prof. Anoc'),
('IT 216',     'Software Engineering',             'BSIT 2-C',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBS 104', 'CBS', 'Prof. Anoc'),

('BA 101',     'Principles of Management',         'BSBA 1-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 101', 'CBS', 'Prof. Bautista'),
('BA 201',     'Business Law',                     'BSBA 2-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 101', 'CBS', 'Prof. Bautista'),
('BA 301',     'Strategic Management',             'BSBA 3-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBS 103', 'CBS', 'Prof. Bautista'),

('ACCT 101',   'Financial Accounting 1',           'BSBA 1-B',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 102', 'CBS', 'Prof. Flores'),
('ACCT 201',   'Financial Accounting 2',           'BSBA 2-B',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBS 201', 'CBS', 'Prof. Flores'),
('ACCT 301',   'Managerial Accounting',            'BSBA 3-B',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBS 201', 'CBS', 'Prof. Flores'),

('FIN 101',    'Business Finance',                 'BSBA 2-A',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBS 202', 'CBS', 'Prof. Garcia'),
('ECON 101',   'Microeconomics',                   'BSBA 1-A',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBS 202', 'CBS', 'Prof. Garcia'),
('FIN 201',    'Investment Management',            'BSBA 3-A',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBS 301', 'CBS', 'Prof. Garcia'),

('MKT 101',    'Principles of Marketing',          'BSBA 1-B',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBS 103', 'CBS', 'Prof. Mendoza'),
('MKT 201',    'Consumer Behavior',                'BSBA 2-B',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBS 301', 'CBS', 'Prof. Mendoza'),
('MKT 301',    'Digital Marketing',                'BSBA 3-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBS 302', 'CBS', 'Prof. Mendoza'),

('MGT 201',    'Operations Management',            'BSBA 2-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 302', 'CBS', 'Prof. Torres'),
('HRM 101',    'Introduction to HRM',              'BSBA 1-A',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBS 401', 'CBS', 'Prof. Torres'),

-- New rooms 105–118 (GF)
('BA 111',     'Business Statistics',              'BSBA 1-B',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 105', 'CBS', 'Prof. Rivera'),
('ACCT 111',   'Accounting Principles',            'BSBA 1-C',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBS 106', 'CBS', 'Prof. Campos'),
('ECON 111',   'Macroeconomics',                   'BSBA 1-A',   ARRAY['M','W','F'], '08:00:00', '09:00:00', 'CBS 107', 'CBS', 'Prof. Soriano'),
('MGT 111',    'Organizational Behavior',          'BSBA 1-C',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBS 108', 'CBS', 'Prof. Valenzuela'),
('BA 121',     'Business Communication',           'BSBA 1-D',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBS 109', 'CBS', 'Prof. Rivera'),
('ACCT 121',   'Cost Accounting',                  'BSBA 2-C',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 110', 'CBS', 'Prof. Campos'),
('ECON 121',   'Business Economics',               'BSBA 2-B',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBS 111', 'CBS', 'Prof. Soriano'),
('MGT 121',    'Human Resource Management',        'BSBA 2-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBS 112', 'CBS', 'Prof. Valenzuela'),
('MKT 111',    'Sales Management',                 'BSBA 2-D',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 113', 'CBS', 'Prof. Rivera'),
('ACCT 131',   'Auditing 1',                       'BSBA 3-C',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBS 114', 'CBS', 'Prof. Campos'),
('FIN 121',    'Corporate Finance',                'BSBA 3-A',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBS 115', 'CBS', 'Prof. Soriano'),
('MGT 131',    'Strategic HR',                     'BSBA 3-D',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBS 116', 'CBS', 'Prof. Valenzuela'),
('MKT 121',    'Brand Management',                 'BSBA 3-C',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBS 117', 'CBS', 'Prof. Rivera'),
('ACCT 141',   'Taxation',                         'BSBA 4-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBS 118', 'CBS', 'Prof. Campos'),

-- === CBS 2nd Floor (203–218) ===
('ECON 201',   'Int''l Trade',                     'BSBA 2-B',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 203', 'CBS', 'Prof. Soriano'),
('MGT 211',    'Supply Chain Management',          'BSBA 3-A',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBS 204', 'CBS', 'Prof. Valenzuela'),
('FIN 211',    'Financial Modeling',               'BSBA 3-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBS 205', 'CBS', 'Prof. Rivera'),
('ACCT 211',   'Int''l Accounting',                'BSBA 3-C',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 206', 'CBS', 'Prof. Campos'),
('ECON 211',   'Development Economics',            'BSBA 3-D',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBS 207', 'CBS', 'Prof. Soriano'),
('MGT 221',    'Knowledge Management',             'BSBA 4-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBS 208', 'CBS', 'Prof. Valenzuela'),
('MKT 211',    'E-Commerce',                       'BSBA 3-B',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBS 209', 'CBS', 'Prof. Rivera'),
('ACCT 221',   'Forensic Accounting',              'BSBA 4-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBS 210', 'CBS', 'Prof. Campos'),
('ECON 221',   'Monetary Economics',               'BSBA 4-A',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBS 211', 'CBS', 'Prof. Soriano'),
('MGT 231',    'Change Management',                'BSBA 4-B',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBS 212', 'CBS', 'Prof. Valenzuela'),
('FIN 221',    'Risk Management',                  'BSBA 4-A',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBS 213', 'CBS', 'Prof. Rivera'),
('ACCT 231',   'Govt & NGO Accounting',            'BSBA 4-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBS 214', 'CBS', 'Prof. Campos'),
('ECON 231',   'Environmental Economics',          'BSBA 4-B',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBS 215', 'CBS', 'Prof. Soriano'),
('MGT 241',    'Business Research',                'BSBA 4-C',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBS 216', 'CBS', 'Prof. Valenzuela'),
('MKT 221',    'Social Media Marketing',           'BSBA 3-D',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBS 217', 'CBS', 'Prof. Rivera'),
('ACCT 241',   'Seminar in Accounting',            'BSBA 4-D',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBS 218', 'CBS', 'Prof. Campos'),

-- === CBS 3rd Floor (303–318) ===
('ECON 301',   'Econometrics',                     'BSBA 3-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 303', 'CBS', 'Prof. Soriano'),
('MGT 301',    'Total Quality Management',         'BSBA 3-B',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBS 304', 'CBS', 'Prof. Valenzuela'),
('FIN 301',    'Portfolio Management',             'BSBA 3-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBS 305', 'CBS', 'Prof. Rivera'),
('ACCT 311',   'Advanced Accounting',              'BSBA 3-D',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 306', 'CBS', 'Prof. Campos'),
('ECON 311',   'Public Economics',                 'BSBA 4-A',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBS 307', 'CBS', 'Prof. Soriano'),
('MGT 311',    'International Business',           'BSBA 3-C',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBS 308', 'CBS', 'Prof. Valenzuela'),
('FIN 311',    'Derivatives & Options',            'BSBA 4-A',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBS 309', 'CBS', 'Prof. Rivera'),
('ACCT 321',   'Business Taxation',                'BSBA 4-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBS 310', 'CBS', 'Prof. Campos'),
('ECON 321',   'Labor Economics',                  'BSBA 4-B',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBS 311', 'CBS', 'Prof. Soriano'),
('MGT 321',    'Entrepreneurship',                 'BSBA 3-D',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBS 312', 'CBS', 'Prof. Valenzuela'),
('FIN 321',    'Real Estate Finance',              'BSBA 4-C',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBS 313', 'CBS', 'Prof. Rivera'),
('ACCT 331',   'IT in Accounting',                 'BSBA 4-A',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBS 314', 'CBS', 'Prof. Campos'),
('ECON 331',   'Economic Policy',                  'BSBA 4-C',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBS 315', 'CBS', 'Prof. Soriano'),
('MGT 331',    'Business Ethics',                  'BSBA 4-D',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBS 316', 'CBS', 'Prof. Valenzuela'),
('MKT 311',    'Advertising Management',           'BSBA 3-B',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBS 317', 'CBS', 'Prof. Rivera'),
('ACCT 341',   'Capstone in Accounting',           'BSBA 4-D',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBS 318', 'CBS', 'Prof. Campos'),

-- === CBS 4th Floor (402–418) ===
('ECON 401',   'Applied Econometrics',             'BSBA 4-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBS 402', 'CBS', 'Prof. Soriano'),
('MGT 401',    'Strategic Planning',               'BSBA 4-A',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBS 403', 'CBS', 'Prof. Valenzuela'),
('FIN 401',    'Corporate Strategy',               'BSBA 4-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBS 404', 'CBS', 'Prof. Rivera'),
('ACCT 401',   'Financial Reporting',              'BSBA 4-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBS 405', 'CBS', 'Prof. Campos'),
('ECON 411',   'Global Economics',                 'BSBA 4-B',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBS 406', 'CBS', 'Prof. Soriano'),
('MGT 411',    'Organizational Leadership',        'BSBA 4-C',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBS 407', 'CBS', 'Prof. Valenzuela'),
('FIN 411',    'Investment Banking',               'BSBA 4-C',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBS 408', 'CBS', 'Prof. Rivera'),
('ACCT 411',   'Seminar in Auditing',              'BSBA 4-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBS 409', 'CBS', 'Prof. Campos'),
('ECON 421',   'Economic Development',             'BSBA 4-D',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBS 410', 'CBS', 'Prof. Soriano'),
('MGT 421',    'Business Simulation',              'BSBA 4-D',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBS 411', 'CBS', 'Prof. Valenzuela'),
('FIN 421',    'Hedge Fund Analysis',              'BSBA 4-D',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBS 412', 'CBS', 'Prof. Rivera'),
('ACCT 421',   'External Audit',                   'BSBA 4-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBS 413', 'CBS', 'Prof. Campos'),
('ECON 431',   'Int''l Finance',                   'BSBA 4-C',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBS 414', 'CBS', 'Prof. Soriano'),
('MGT 431',    'Thesis in Management',             'BSBA 4-D',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBS 415', 'CBS', 'Prof. Valenzuela'),
('MKT 401',    'Marketing Research',               'BSBA 4-A',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBS 416', 'CBS', 'Prof. Rivera'),
('ACCT 431',   'Accounting Thesis',                'BSBA 4-D',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBS 417', 'CBS', 'Prof. Campos'),
('ECON 441',   'Independent Study in Econ',        'BSBA 4-D',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBS 418', 'CBS', 'Prof. Soriano'),

-- ==================================================
-- CBE BUILDING — College of Business Education
-- ==================================================

-- Existing instructors
('IT 383-EL4', 'Web Systems & Technologies',       'BSED 3-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 201', 'CBE', 'Prof. Anoc'),
('IT 217',     'Human-Computer Interaction',       'BSED 2-B',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBE 104', 'CBE', 'Prof. Anoc'),

('EDUC 101',   'Principles of Teaching 1',         'BSED 1-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 101', 'CBE', 'Prof. Castro'),
('EDUC 201',   'Principles of Teaching 2',         'BSED 2-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 101', 'CBE', 'Prof. Castro'),
('EDUC 301',   'Curriculum Development',           'BSED 3-A',   ARRAY['M','W','F'], '12:00:00', '13:00:00', 'CBE 102', 'CBE', 'Prof. Castro'),

('HRM 201',    'Food & Beverage Service',          'BSHRM 2-A',  ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBE 102', 'CBE', 'Prof. Aquino'),
('HRM 301',    'Front Office Operations',          'BSHRM 3-A',  ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBE 201', 'CBE', 'Prof. Aquino'),
('HRM 401',    'Event Management',                 'BSHRM 4-A',  ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBE 202', 'CBE', 'Prof. Aquino'),

('TOUR 101',   'Introduction to Tourism',          'BSTM 1-A',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBE 202', 'CBE', 'Prof. Ramos'),
('TOUR 201',   'Tour Guiding Services',            'BSTM 2-A',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBE 203', 'CBE', 'Prof. Ramos'),
('TOUR 301',   'Sustainable Tourism',              'BSTM 3-A',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBE 203', 'CBE', 'Prof. Ramos'),

('GE 101',     'Purposive Communication',          'BSED 1-B',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBE 301', 'CBE', 'Prof. Fernandez'),
('GE 102',     'Readings in Philippine History',   'BSHRM 1-A',  ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBE 301', 'CBE', 'Prof. Fernandez'),
('GE 103',     'The Contemporary World',           'BSTM 2-B',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBE 302', 'CBE', 'Prof. Fernandez'),

('PE 101',     'Physical Fitness',                 'BSED 1-A',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBE 401', 'CBE', 'Prof. Navarro'),
('PE 102',     'Rhythmic Activities',              'BSHRM 1-A',  ARRAY['M','TH'],    '17:30:00', '19:00:00', 'CBE 401', 'CBE', 'Prof. Navarro'),

-- New rooms 105–118 (GF)
('EDUC 111',   'Child Dev & Learning',             'BSED 1-B',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 105', 'CBE', 'Prof. Domingo'),
('TOUR 111',   'Travel & Tourism Intro',           'BSTM 1-B',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBE 106', 'CBE', 'Prof. Santiago'),
('HRM 111',    'Hospitality Principles',           'BSHRM 1-B',  ARRAY['M','W','F'], '08:00:00', '09:00:00', 'CBE 107', 'CBE', 'Prof. Macaraeg'),
('PE 111',     'Sports Science',                   'BSED 1-C',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBE 108', 'CBE', 'Prof. Tolentino'),
('EDUC 121',   'Facilitating Learning',            'BSED 1-C',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBE 109', 'CBE', 'Prof. Domingo'),
('TOUR 121',   'Cultural Tourism',                 'BSTM 1-B',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 110', 'CBE', 'Prof. Santiago'),
('HRM 121',    'Front Desk Operations',            'BSHRM 1-B',  ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBE 111', 'CBE', 'Prof. Macaraeg'),
('PE 121',     'Health & Fitness',                 'BSED 2-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBE 112', 'CBE', 'Prof. Tolentino'),
('EDUC 211',   'Special Education',                'BSED 2-C',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 113', 'CBE', 'Prof. Domingo'),
('TOUR 211',   'Eco-Tourism',                      'BSTM 2-B',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBE 114', 'CBE', 'Prof. Santiago'),
('HRM 211',    'Housekeeping Operations',          'BSHRM 2-B',  ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBE 115', 'CBE', 'Prof. Macaraeg'),
('PE 131',     'Team Sports',                      'BSED 1-D',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBE 116', 'CBE', 'Prof. Tolentino'),
('EDUC 221',   'Curriculum Design',                'BSED 3-B',   ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBE 117', 'CBE', 'Prof. Domingo'),
('TOUR 221',   'Resort Management',                'BSTM 2-B',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBE 118', 'CBE', 'Prof. Santiago'),

-- === CBE 2nd Floor (204–218) ===
('HRM 221',    'F&B Operations',                   'BSHRM 2-B',  ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 204', 'CBE', 'Prof. Macaraeg'),
('PE 201',     'Outdoor Recreation',               'BSED 2-D',   ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBE 205', 'CBE', 'Prof. Tolentino'),
('EDUC 311',   'Assessment & Evaluation',          'BSED 3-B',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBE 206', 'CBE', 'Prof. Domingo'),
('TOUR 311',   'Tourism Policy',                   'BSTM 3-B',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 207', 'CBE', 'Prof. Santiago'),
('HRM 311',    'Event Planning',                   'BSHRM 3-B',  ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBE 208', 'CBE', 'Prof. Macaraeg'),
('PE 211',     'Dance & Rhythmics',                'BSED 2-C',   ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBE 209', 'CBE', 'Prof. Tolentino'),
('EDUC 321',   'Educational Technology',           'BSED 3-D',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBE 210', 'CBE', 'Prof. Domingo'),
('TOUR 321',   'Destination Management',           'BSTM 3-B',   ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBE 211', 'CBE', 'Prof. Santiago'),
('HRM 321',    'Banquet Operations',               'BSHRM 3-B',  ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBE 212', 'CBE', 'Prof. Macaraeg'),
('PE 221',     'Water Sports',                     'BSED 3-C',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBE 213', 'CBE', 'Prof. Tolentino'),
('NSTP 101',   'Civic Welfare Training 1',         'BSED 1-A',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBE 214', 'CBE', 'Prof. Domingo'),
('TOUR 331',   'Tourism Research',                 'BSTM 4-A',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBE 215', 'CBE', 'Prof. Santiago'),
('HRM 331',    'Hotel Management',                 'BSHRM 3-C',  ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBE 216', 'CBE', 'Prof. Macaraeg'),
('PE 231',     'Racket Sports',                    'BSED 2-D',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBE 217', 'CBE', 'Prof. Tolentino'),
('NSTP 201',   'Literacy Training Service',        'BSED 1-B',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBE 218', 'CBE', 'Prof. Domingo'),

-- === CBE 3rd Floor (303–318) ===
('TOUR 401',   'Int''l Tourism Management',        'BSTM 4-A',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 303', 'CBE', 'Prof. Santiago'),
('HRM 411',    'Hotel Law & Ethics',               'BSHRM 4-A',  ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBE 304', 'CBE', 'Prof. Macaraeg'),
('PE 301',     'Exercise Physiology',              'BSED 3-D',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBE 305', 'CBE', 'Prof. Tolentino'),
('EDUC 401',   'Teaching Practicum',               'BSED 4-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 306', 'CBE', 'Prof. Domingo'),
('TOUR 411',   'Tourism Practicum',                'BSTM 4-B',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBE 307', 'CBE', 'Prof. Santiago'),
('HRM 421',    'Food Production',                  'BSHRM 4-B',  ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBE 308', 'CBE', 'Prof. Macaraeg'),
('PE 311',     'Sports Psychology',                'BSED 4-A',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBE 309', 'CBE', 'Prof. Tolentino'),
('EDUC 411',   'Educational Leadership',           'BSED 4-B',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBE 310', 'CBE', 'Prof. Domingo'),
('GE 211',     'Contemporary Literature',          'BSTM 2-A',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBE 311', 'CBE', 'Prof. Santiago'),
('HRM 431',    'Tourism Operations',               'BSHRM 4-C',  ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBE 312', 'CBE', 'Prof. Macaraeg'),
('PE 321',     'Coaching & Officiating',           'BSED 4-B',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBE 313', 'CBE', 'Prof. Tolentino'),
('EDUC 421',   'Community Engagement',             'BSED 4-C',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBE 314', 'CBE', 'Prof. Domingo'),
('TOUR 421',   'Thesis in Tourism',                'BSTM 4-C',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBE 315', 'CBE', 'Prof. Santiago'),
('HRM 441',    'Capstone in HRM',                  'BSHRM 4-D',  ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBE 316', 'CBE', 'Prof. Macaraeg'),
('PE 331',     'Sports Nutrition',                 'BSED 3-C',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBE 317', 'CBE', 'Prof. Tolentino'),
('EDUC 431',   'Thesis Seminar',                   'BSED 4-D',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBE 318', 'CBE', 'Prof. Domingo'),

-- === CBE 4th Floor (402–418) ===
('TOUR 431',   'Sustainable Tourism Dev',          'BSTM 4-D',   ARRAY['M','TH'],    '07:30:00', '09:00:00', 'CBE 402', 'CBE', 'Prof. Santiago'),
('HRM 451',    'Research in Hospitality',          'BSHRM 4-D',  ARRAY['T','F'],     '07:30:00', '09:00:00', 'CBE 403', 'CBE', 'Prof. Macaraeg'),
('PE 401',     'Sports Administration',            'BSED 4-C',   ARRAY['M','TH'],    '09:00:00', '10:30:00', 'CBE 404', 'CBE', 'Prof. Tolentino'),
('EDUC 441',   'Assessment Methods',               'BSED 4-A',   ARRAY['T','F'],     '09:00:00', '10:30:00', 'CBE 405', 'CBE', 'Prof. Domingo'),
('GE 221',     'Science, Tech & Society',          'BSTM 1-A',   ARRAY['M','W','F'], '10:00:00', '11:00:00', 'CBE 406', 'CBE', 'Prof. Santiago'),
('HRM 461',    'Int''l Hospitality',               'BSHRM 4-D',  ARRAY['M','TH'],    '10:30:00', '12:00:00', 'CBE 407', 'CBE', 'Prof. Macaraeg'),
('PE 411',     'Fitness Instruction',              'BSED 4-D',   ARRAY['T','F'],     '10:30:00', '12:00:00', 'CBE 408', 'CBE', 'Prof. Tolentino'),
('EDUC 451',   'Research Writing',                 'BSED 4-D',   ARRAY['M','W','F'], '11:00:00', '12:00:00', 'CBE 409', 'CBE', 'Prof. Domingo'),
('TOUR 441',   'Cultural Heritage Mgmt',           'BSTM 4-D',   ARRAY['M','TH'],    '12:00:00', '13:30:00', 'CBE 410', 'CBE', 'Prof. Santiago'),
('HRM 471',    'Thesis in Hospitality',            'BSHRM 4-D',  ARRAY['T','F'],     '12:00:00', '13:30:00', 'CBE 411', 'CBE', 'Prof. Macaraeg'),
('PE 421',     'Recreation Therapy',               'BSED 4-C',   ARRAY['M','W','F'], '13:00:00', '14:00:00', 'CBE 412', 'CBE', 'Prof. Tolentino'),
('EDUC 461',   'Seminar in Education',             'BSED 4-D',   ARRAY['M','TH'],    '13:30:00', '15:00:00', 'CBE 413', 'CBE', 'Prof. Domingo'),
('TOUR 451',   'Industry Practicum',               'BSTM 4-D',   ARRAY['T','F'],     '13:30:00', '15:00:00', 'CBE 414', 'CBE', 'Prof. Santiago'),
('HRM 481',    'Hospitality Seminar',              'BSHRM 4-D',  ARRAY['M','TH'],    '15:00:00', '16:30:00', 'CBE 415', 'CBE', 'Prof. Macaraeg'),
('PE 431',     'Adaptive Sports',                  'BSED 4-D',   ARRAY['T','F'],     '15:00:00', '16:30:00', 'CBE 416', 'CBE', 'Prof. Tolentino'),
('EDUC 471',   'Teaching Internship',              'BSED 4-D',   ARRAY['M','W','F'], '14:00:00', '15:00:00', 'CBE 417', 'CBE', 'Prof. Domingo'),
('TOUR 461',   'Seminar in Tourism',               'BSTM 4-D',   ARRAY['T','F'],     '17:30:00', '19:00:00', 'CBE 418', 'CBE', 'Prof. Santiago');
