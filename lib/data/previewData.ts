export const previewRooms = [
  { id: 'room-a', name: 'A101', building: 'Science Hall' },
  { id: 'room-b', name: 'B204', building: 'Engineering Center' },
  { id: 'room-c', name: 'C303', building: 'Math Building' },
]

export const previewInstructors = [
  { id: 'inst-1', full_name: 'Dr. Maya Patel', department: 'Biology' },
  { id: 'inst-2', full_name: 'Prof. Jordan Lee', department: 'Computer Science' },
  { id: 'inst-3', full_name: 'Dr. Avery Nguyen', department: 'Mathematics' },
]

export const previewBookings = [
  {
    id: '1',
    room_id: 'room-a',
    instructor_id: 'inst-1',
    class_name: 'Intro to Biology',
    date: '2026-04-21',
    start_time: '09:00',
    end_time: '10:30',
    status: 'confirmed',
    rooms: { id: 'room-a', name: 'A101', building: 'Science Hall' },
    instructors: { id: 'inst-1', full_name: 'Dr. Maya Patel', department: 'Biology' },
  },
  {
    id: '2',
    room_id: 'room-b',
    instructor_id: 'inst-2',
    class_name: 'Data Structures',
    date: '2026-04-22',
    start_time: '11:00',
    end_time: '12:30',
    status: 'confirmed',
    rooms: { id: 'room-b', name: 'B204', building: 'Engineering Center' },
    instructors: { id: 'inst-2', full_name: 'Prof. Jordan Lee', department: 'Computer Science' },
  },
  {
    id: '3',
    room_id: 'room-c',
    instructor_id: 'inst-3',
    class_name: 'Calculus II',
    date: '2026-04-23',
    start_time: '14:00',
    end_time: '15:30',
    status: 'confirmed',
    rooms: { id: 'room-c', name: 'C303', building: 'Math Building' },
    instructors: { id: 'inst-3', full_name: 'Dr. Avery Nguyen', department: 'Mathematics' },
  },
  {
    id: '4',
    room_id: 'room-a',
    instructor_id: 'inst-2',
    class_name: 'Software Engineering',
    date: '2026-04-24',
    start_time: '13:00',
    end_time: '14:30',
    status: 'confirmed',
    rooms: { id: 'room-a', name: 'A101', building: 'Science Hall' },
    instructors: { id: 'inst-2', full_name: 'Prof. Jordan Lee', department: 'Computer Science' },
  },
]
