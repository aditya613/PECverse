import { api } from './api';

export interface ClassExam {
  code: string;
  subject: string;
  rooms?: string;
  note?: string;
  is_backlog?: boolean;
  is_minor?: boolean;
}

export interface ExamSlot {
  id: string;
  date: string;
  day: string;
  time: string;
  start_time: string;
  end_time: string;
  coordinator?: string | null;
  classes: Record<string, ClassExam | undefined>;
}

export interface BranchMeta {
  id: string;
  label: string;
  semester: string;
  branch: string;
}

export interface PersonalizedExam {
  id: number | string;
  exam_date: string;
  day_name: string;
  time_slot: string;
  start_time: string;
  end_time: string;
  branch_key: string;
  semester: string;
  branch_name: string;
  subject_code: string;
  subject_name: string;
  seating_rooms?: string;
  coordinator_duty?: string;
  is_backlog: boolean;
  is_minor: boolean;
  notes?: string;
  matched_regular_subject?: string | null;
  days_until?: number;
}

export interface UserClassMapping {
  has_mapping: boolean;
  branch_key: string;
  class_info: {
    class_id: number;
    year: number;
    group_name: string;
    branch_code: string;
    branch_name: string;
  } | null;
  my_exams: PersonalizedExam[];
  backlog_exams: PersonalizedExam[];
  minor_exams: PersonalizedExam[];
}

export interface DatesheetData {
  notice_no: string;
  notice_date: string;
  title: string;
  period: string;
  department: string;
  institution: string;
  branches: BranchMeta[];
  instructions: string[];
  schedule: ExamSlot[];
  user_mapping?: UserClassMapping;
}

export interface DatesheetResponse {
  status: string;
  data: DatesheetData;
}

export const OFFLINE_FALLBACK_DATESHEET: DatesheetData = {
  notice_no: 'PEC/CSE/265',
  notice_date: '2026-09-25',
  title: 'CSE Department Datesheet for Mid Term Examinations',
  period: '1st - 8th October 2026',
  department: 'Computer Science & Engineering',
  institution: 'Punjab Engineering College, Chandigarh',
  branches: [
    { id: 'all', label: 'Master Grid (All)', semester: 'All', branch: 'All' },
    { id: '1st_sem', label: '1st Sem Common', semester: '1st Sem', branch: 'Institute Common' },
    { id: '3rd_cse', label: '3rd Sem CSE', semester: '3rd Sem', branch: 'CSE' },
    { id: '3rd_ds', label: '3rd Sem DS', semester: '3rd Sem', branch: 'Data Science' },
    { id: '3rd_ai', label: '3rd Sem AI', semester: '3rd Sem', branch: 'AI' },
    { id: '5th_cse', label: '5th Sem CSE', semester: '5th Sem', branch: 'CSE' },
    { id: '5th_ds', label: '5th Sem DS', semester: '5th Sem', branch: 'Data Science' },
    { id: '5th_ai', label: '5th Sem AI', semester: '5th Sem', branch: 'AI' },
    { id: '7th_cse', label: '7th Sem CSE', semester: '7th Sem', branch: 'CSE' },
    { id: '7th_ds', label: '7th Sem DS', semester: '7th Sem', branch: 'Data Science' },
    { id: '7th_ai', label: '7th Sem AI', semester: '7th Sem', branch: 'AI' },
    { id: 'mtech_cse', label: '1st Sem M.Tech', semester: '1st Sem MTech', branch: 'MTech CSE' },
  ],
  instructions: [
    'Students must occupy their allotted seats 15 minutes before exam commencement.',
    'Institute Identity Card and Mid-Term Admit Slip are strictly mandatory.',
    'Mobile phones, smartwatches, and programmable calculators are prohibited in exam halls.',
    'Seating centers (DH1 to DH5, L10 to L31) are marked by department coordination.',
  ],
  schedule: [
    // 01/10/2026 (Thursday)
    {
      id: 'slot_1',
      date: '2026-10-01',
      day: 'Thursday',
      time: '9:30 AM - 11:00 AM',
      start_time: '09:30',
      end_time: '11:00',
      coordinator: 'Dr. Mamta Dabra (ES2301)',
      classes: {
        '1st_sem': {
          code: 'ES 2301 (Pool A)',
          subject: 'Introduction to Computer Programming',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31 (506)',
          note: 'Backlog students',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'ES 2301',
          subject: 'Introduction to Computer Programming (Backlog)',
          rooms: 'DH1 - DH5, L26 - L31',
          is_backlog: true,
        },
        '3rd_ds': {
          code: 'ES 2301',
          subject: 'Introduction to Computer Programming (Backlog)',
          rooms: 'DH1 - DH5, L26 - L31',
          is_backlog: true,
        },
        '3rd_ai': {
          code: 'ES 2301',
          subject: 'Introduction to Computer Programming (Backlog)',
          rooms: 'DH1 - DH5, L26 - L31',
          is_backlog: true,
        },
        'mtech_cse': {
          code: 'CSR 1101',
          subject: 'Advanced Data Structures & Algorithms',
          rooms: 'CSE Dept Rooms',
        },
      },
    },
    {
      id: 'slot_2',
      date: '2026-10-01',
      day: 'Thursday',
      time: '11:30 AM - 1:00 PM',
      start_time: '11:30',
      end_time: '13:00',
      classes: {
        '1st_sem': {
          code: 'CH 2301 (Pool B)',
          subject: 'Applied Chemistry I (ECE, M&C, AI-VLSI)',
          rooms: 'DH1, DH2, L10, L11 (231)',
        },
        '7th_cse': {
          code: 'HSM-III: MHN4004 / MHN4005',
          subject: 'Humanities Elective: MHN4004 / MHN4005',
          rooms: 'DH3, DH4, L26 - L31 (121-178-299)',
        },
        '7th_ds': {
          code: 'HSM-III: MHN4004 / MHN4005',
          subject: 'Humanities Elective: MHN4004 / MHN4005',
          rooms: 'DH3, DH4, L26 - L31 (121-178-299)',
        },
        '7th_ai': {
          code: 'HSM-III: MHN4004 / MHN4005',
          subject: 'Humanities Elective: MHN4004 / MHN4005',
          rooms: 'DH3, DH4, L26 - L31 (121-178-299)',
        },
      },
    },
    {
      id: 'slot_3',
      date: '2026-10-01',
      day: 'Thursday',
      time: '1:30 PM - 3:00 PM',
      start_time: '13:30',
      end_time: '15:00',
      classes: {
        '1st_sem': {
          code: 'CH 2302 (Pool B)',
          subject: 'Applied Chemistry II (Aero, Meta, Mech) / CH 2301/2302 Backlog',
          rooms: 'DH1, DH2, DH3, DH4 (231)',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'CH 2301 / CH 2302',
          subject: 'Applied Chemistry I / II (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4',
          is_backlog: true,
        },
        '3rd_ds': {
          code: 'CH 2301 / CH 2302',
          subject: 'Applied Chemistry I / II (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4',
          is_backlog: true,
        },
        '3rd_ai': {
          code: 'CH 2301 / CH 2302',
          subject: 'Applied Chemistry I / II (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4',
          is_backlog: true,
        },
      },
    },
    {
      id: 'slot_4',
      date: '2026-10-01',
      day: 'Thursday',
      time: '3:30 PM - 5:00 PM',
      start_time: '15:30',
      end_time: '17:00',
      coordinator: 'Dr. Satnam Kaur (OOP)',
      classes: {
        '3rd_cse': {
          code: 'CTN 304',
          subject: 'Object Oriented Programming',
          rooms: 'CSE Lecture Theatres',
        },
        '3rd_ds': {
          code: 'DSN 3003',
          subject: 'Operating Systems',
          rooms: 'CSE Lecture Theatres',
        },
        '3rd_ai': {
          code: 'AIN 3002',
          subject: 'Object Oriented Programming',
          rooms: 'CSE Lecture Theatres',
        },
        '7th_cse': {
          code: 'HSM-III: MHN4001, MHN4002, MHN4003',
          subject: 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
          rooms: 'DH1 - DH4, L10, L26 - L31',
        },
        '7th_ds': {
          code: 'HSM-III: MHN4001, MHN4002, MHN4003',
          subject: 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
          rooms: 'DH1 - DH4, L10, L26 - L31',
        },
        '7th_ai': {
          code: 'HSM-III: MHN4001, MHN4002, MHN4003',
          subject: 'Humanities Elective (MHN4001 / MHN4002 / MHN4003)',
          rooms: 'DH1 - DH4, L10, L26 - L31',
        },
      },
    },

    // 05/10/2026 (Monday)
    {
      id: 'slot_5',
      date: '2026-10-05',
      day: 'Monday',
      time: '9:30 AM - 11:00 AM',
      start_time: '09:30',
      end_time: '11:00',
      coordinator: 'CSN5001 - Dr. Sandeep Harit',
      classes: {
        '1st_sem': {
          code: 'MA 2301 (Pool A)',
          subject: 'Calculus',
          rooms: 'DH1 - DH5, T3, L10, L11, L26 - L28 (506)',
        },
        '5th_cse': {
          code: 'CSN 5001',
          subject: 'Theory of Computation (TOC)',
          rooms: 'CSE Dept Theatres',
        },
        '5th_ai': {
          code: 'AIN 5001',
          subject: 'Theory of Computation (TOC)',
          rooms: 'CSE Dept Theatres',
        },
        '7th_cse': {
          code: 'CSE 1013',
          subject: 'Digital Image Processing',
          rooms: 'CSE Dept Theatres',
        },
        '7th_ds': {
          code: 'DSE 1013',
          subject: 'Digital Image Processing',
          rooms: 'CSE Dept Theatres',
        },
        'mtech_cse': {
          code: 'Dept. Elective-I: CSR 1202',
          subject: 'Explainable AI',
          rooms: 'CSE Dept Rooms',
        },
      },
    },
    {
      id: 'slot_6',
      date: '2026-10-05',
      day: 'Monday',
      time: '11:30 AM - 1:00 PM',
      start_time: '11:30',
      end_time: '13:00',
      classes: {
        '5th_ds': {
          code: 'DSN 5003',
          subject: 'Software Engineering',
          rooms: 'CSE Dept Theatres',
        },
      },
    },
    {
      id: 'slot_7',
      date: '2026-10-05',
      day: 'Monday',
      time: '1:30 PM - 3:00 PM',
      start_time: '13:30',
      end_time: '15:00',
      coordinator: 'Other dept',
      classes: {
        '1st_sem': {
          code: 'MA 2301 (Pool B)',
          subject: 'Calculus (All Backlog students of B.Tech 1st Sem Maths*)',
          rooms: 'DH1 - DH5, L10, L11, L26 - L28 (462)',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'MA 2301',
          subject: 'Calculus (Backlog Students)',
          rooms: 'DH1 - DH5, L10, L11, L26 - L28',
          is_backlog: true,
        },
        '3rd_ds': {
          code: 'MA 2301',
          subject: 'Calculus (Backlog Students)',
          rooms: 'DH1 - DH5, L10, L11, L26 - L28',
          is_backlog: true,
        },
        '3rd_ai': {
          code: 'MA 2301',
          subject: 'Calculus (Backlog Students)',
          rooms: 'DH1 - DH5, L10, L11, L26 - L28',
          is_backlog: true,
        },
        'mtech_cse': {
          code: 'DERM',
          subject: 'DERM',
          rooms: 'L30 - L31',
        },
      },
    },
    {
      id: 'slot_8',
      date: '2026-10-05',
      day: 'Monday',
      time: '3:30 PM - 5:00 PM',
      start_time: '15:30',
      end_time: '17:00',
      coordinator: 'CTN301 - Mayank Gupta',
      classes: {
        '3rd_cse': {
          code: 'CTN 301',
          subject: 'Data Structures',
          rooms: 'CSE Dept Theatres',
        },
        '3rd_ds': {
          code: 'DSN 3001',
          subject: 'Data Structures',
          rooms: 'CSE Dept Theatres',
        },
        '3rd_ai': {
          code: 'AIN 3001',
          subject: 'Data Structures',
          rooms: 'CSE Dept Theatres',
        },
        '7th_cse': {
          code: 'CSE 1009',
          subject: 'Wireless & Mobile Networks',
          rooms: 'CSE Dept Theatres',
        },
        '7th_ds': {
          code: 'DSE 1009',
          subject: 'Wireless & Mobile Networks',
          rooms: 'CSE Dept Theatres',
        },
        '7th_ai': {
          code: 'AIE 1009',
          subject: 'Natural Language Processing',
          rooms: 'CSE Dept Theatres',
        },
      },
    },

    // 06/10/2026 (Tuesday)
    {
      id: 'slot_9',
      date: '2026-10-06',
      day: 'Tuesday',
      time: '9:30 AM - 11:00 AM',
      start_time: '09:30',
      end_time: '11:00',
      coordinator: 'Dr. Shilpa (DBMS)',
      classes: {
        '1st_sem': {
          code: 'ES 2302 (Pool B)',
          subject: 'Engineering Drawing with CAD software (ECE, M&C, AI-VLSI)',
          rooms: 'DH1 - DH5 (231)',
        },
        '5th_cse': {
          code: 'CSN 5004',
          subject: 'Database Management Systems (DBMS)',
          rooms: 'CSE Dept Theatres',
        },
        '5th_ds': {
          code: 'DSN 5004',
          subject: 'Internet of Things (IoT)',
          rooms: 'CSE Dept Theatres',
        },
        '5th_ai': {
          code: 'AIN 5002',
          subject: 'Deep Learning',
          rooms: 'CSE Dept Theatres',
        },
        'mtech_cse': {
          code: 'CSR 1102',
          subject: 'AI & Data Analysis',
          rooms: 'CSE Dept Rooms',
        },
      },
    },
    {
      id: 'slot_10',
      date: '2026-10-06',
      day: 'Tuesday',
      time: '11:30 AM - 1:00 PM',
      start_time: '11:30',
      end_time: '13:00',
      classes: {
        '5th_cse': {
          code: 'CSM 1003',
          subject: 'Minor: Database Management Systems (MSC B.Tech 3rd year)',
          rooms: 'CSE Dept Theatres',
          is_minor: true,
        },
        '5th_ds': {
          code: 'DSM 1003',
          subject: 'Minor: ATDS (MSC B.Tech 3rd year)',
          rooms: 'CSE Dept Theatres',
          is_minor: true,
        },
        '5th_ai': {
          code: 'AIM 1003',
          subject: 'Minor: HMI (Human Machine Interface) (MSC B.Tech 3rd year)',
          rooms: 'CSE Dept Theatres',
          is_minor: true,
        },
      },
    },
    {
      id: 'slot_11',
      date: '2026-10-06',
      day: 'Tuesday',
      time: '1:30 PM - 3:00 PM',
      start_time: '13:30',
      end_time: '15:00',
      coordinator: 'CTN302 - Dr. Amanpreet Singh',
      classes: {
        '3rd_cse': {
          code: 'CTN 302',
          subject: 'Data Science & Machine Learning',
          rooms: 'CSE Lecture Theatres',
        },
        '3rd_ds': {
          code: 'DSN 3002',
          subject: 'Python for Data Science',
          rooms: 'CSE Lecture Theatres',
        },
        '3rd_ai': {
          code: 'AIN 3003',
          subject: 'Data Science & Machine Learning',
          rooms: 'CSE Lecture Theatres',
        },
        'mtech_cse': {
          code: 'Engg. Maths',
          subject: 'Engineering Mathematics',
          rooms: 'L26, L27',
        },
      },
    },
    {
      id: 'slot_12',
      date: '2026-10-06',
      day: 'Tuesday',
      time: '3:30 PM - 5:00 PM',
      start_time: '15:30',
      end_time: '17:00',
      coordinator: 'Dr. Navdeep (DL)',
      classes: {
        '1st_sem': {
          code: 'ES 2302 (Pool B)',
          subject: 'Engineering Drawing with CAD software (Aero, Meta, Mech) (Backlog students)',
          rooms: 'DH1 - DH4 (231)',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'ES 2302',
          subject: 'Engineering Drawing with CAD software (Backlog students)',
          rooms: 'DH1 - DH4',
          is_backlog: true,
        },
        '7th_cse': {
          code: 'CSE 1007',
          subject: 'Deep Learning',
          rooms: 'CSE Dept Rooms',
        },
        '7th_ds': {
          code: 'DSE 1011',
          subject: 'Data & Internet Security',
          rooms: 'CSE Dept Rooms',
        },
        '7th_ai': {
          code: 'AIE 1008',
          subject: 'Computer Vision & Image Processing',
          rooms: 'CSE Dept Rooms',
        },
      },
    },

    // 07/10/2026 (Wednesday)
    {
      id: 'slot_13',
      date: '2026-10-07',
      day: 'Wednesday',
      time: '9:30 AM - 11:00 AM',
      start_time: '09:30',
      end_time: '11:00',
      classes: {
        '3rd_cse': {
          code: 'CSM 1001',
          subject: 'Minor: Object Oriented Programming (B.Tech 2nd year)',
          rooms: 'L29, L30, L31, DH5 (176)',
          is_minor: true,
        },
        '3rd_ds': {
          code: 'DSM 1001',
          subject: 'Minor: Python for Data Science (B.Tech 2nd year)',
          rooms: 'L29, L30, L31, DH5',
          is_minor: true,
        },
        '3rd_ai': {
          code: 'AIM 1001',
          subject: 'Minor: MFAI (B.Tech 2nd year)',
          rooms: 'L29, L30, L31, DH5',
          is_minor: true,
        },
        'mtech_cse': {
          code: 'CSR 1103',
          subject: 'Special Topics in Wireless & Mobile Networks',
          rooms: 'CSE Dept Classrooms',
        },
      },
    },
    {
      id: 'slot_14',
      date: '2026-10-07',
      day: 'Wednesday',
      time: '11:30 AM - 1:00 PM',
      start_time: '11:30',
      end_time: '13:00',
      coordinator: 'Dr. Suraj Srivastava (DAIR)',
      classes: {
        '5th_ds': {
          code: 'DSN 5001',
          subject: 'Data Acquisition & Information Retrieval',
          rooms: 'CSE Dept Halls',
        },
        '5th_ai': {
          code: 'AIN 5004',
          subject: 'Computer Networks',
          rooms: 'CSE Dept Halls',
        },
        '7th_cse': {
          code: 'CSO 1003',
          subject: 'Open Elective-2: DAIR',
          rooms: 'DH1, DH2 (120)',
        },
        '7th_ds': {
          code: 'CSO 1003',
          subject: 'Open Elective-2: DAIR',
          rooms: 'DH1, DH2',
        },
        '7th_ai': {
          code: 'CSO 1003',
          subject: 'Open Elective-2: DAIR',
          rooms: 'DH1, DH2',
        },
      },
    },
    {
      id: 'slot_15',
      date: '2026-10-07',
      day: 'Wednesday',
      time: '1:30 PM - 3:00 PM',
      start_time: '13:30',
      end_time: '15:00',
      classes: {
        '1st_sem': {
          code: 'ES 2305 (Pool A)',
          subject: 'Introduction to Electronics & Electrical Engineering (CSE, DS, EE) (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, L26, L27, L28 (330)',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'ES 2305 / ES 2306',
          subject: 'Intro to Electronics & Electrical / SOM (Backlog)',
          rooms: 'DH1 - DH4, L26-L28 / L29-L31, DH5',
          is_backlog: true,
        },
        '3rd_ds': {
          code: 'ES 2305',
          subject: 'Intro to Electronics & Electrical Engineering (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, L26, L27, L28',
          is_backlog: true,
        },
        '3rd_ai': {
          code: 'ES 2305',
          subject: 'Intro to Electronics & Electrical Engineering (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, L26, L27, L28',
          is_backlog: true,
        },
      },
    },
    {
      id: 'slot_16',
      date: '2026-10-07',
      day: 'Wednesday',
      time: '3:30 PM - 5:00 PM',
      start_time: '15:30',
      end_time: '17:00',
      coordinator: 'Dr. Tejinder Kaur (SE)',
      classes: {
        '5th_cse': {
          code: 'CSN 5003',
          subject: 'Software Engineering',
          rooms: 'CSE Dept Lecture Halls',
        },
      },
    },

    // 08/10/2026 (Thursday)
    {
      id: 'slot_17',
      date: '2026-10-08',
      day: 'Thursday',
      time: '9:30 AM - 11:00 AM',
      start_time: '09:30',
      end_time: '11:00',
      coordinator: 'CSE1010 - Dr. Vivek Dabra',
      classes: {
        '1st_sem': {
          code: 'ES 2304 (Pool B)',
          subject: 'Introduction to Mechatronics (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27 (462)',
          is_backlog: true,
        },
        '3rd_cse': {
          code: 'ES 2304',
          subject: 'Introduction to Mechatronics (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27',
          is_backlog: true,
        },
        '5th_ai': {
          code: 'AIN 5003',
          subject: 'Human Machine Interaction',
          rooms: 'CSE Dept Halls',
        },
        '7th_cse': {
          code: 'CSE 1010',
          subject: 'Cloud Computing',
          rooms: 'CSE Dept Halls',
        },
        '7th_ds': {
          code: 'DSE 1010',
          subject: 'Advances of Intelligent & Learning Agents',
          rooms: 'CSE Dept Halls',
        },
        'mtech_cse': {
          code: 'Soft Computing / Soft Skill & Management',
          subject: 'Soft Computing / Soft Skill & Management',
          rooms: 'L30 - L31',
        },
      },
    },
    {
      id: 'slot_18',
      date: '2026-10-08',
      day: 'Thursday',
      time: '11:30 AM - 1:00 PM',
      start_time: '11:30',
      end_time: '13:00',
      classes: {
        '1st_sem': {
          code: 'PY 2301 (Pool A)',
          subject: 'Electromagnetic Theory & Quantum Physics (CSE, EE, DS)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L11 (530)',
        },
        '3rd_cse': {
          code: 'PY 2301 / PY 2302',
          subject: 'Physics (Backlog students)',
          rooms: 'DH1-DH5, L11 / L26-L29, L10',
          is_backlog: true,
        },
        '3rd_ds': {
          code: 'PY 2301',
          subject: 'Electromagnetic Theory & Quantum Physics (Backlog)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L11',
          is_backlog: true,
        },
      },
    },
    {
      id: 'slot_19',
      date: '2026-10-08',
      day: 'Thursday',
      time: '1:30 PM - 3:00 PM',
      start_time: '13:30',
      end_time: '15:00',
      coordinator: 'Dr. Dipika Gupta (SC)',
      classes: {
        '5th_cse': {
          code: 'CSN 5002',
          subject: 'Soft Computing',
          rooms: 'CSE Dept Halls',
        },
        '5th_ds': {
          code: 'DSN 5002',
          subject: 'Analytical Tools for Data Science',
          rooms: 'CSE Dept Halls',
        },
        'mtech_cse': {
          code: 'CSR 1207',
          subject: 'Information Retrieval',
          rooms: 'CSE Dept Classrooms',
        },
      },
    },
    {
      id: 'slot_20',
      date: '2026-10-08',
      day: 'Thursday',
      time: '3:30 PM - 5:00 PM',
      start_time: '15:30',
      end_time: '17:00',
      coordinator: 'Amandeep Kaur (DSCS)',
      classes: {
        '3rd_cse': {
          code: 'CTN 303',
          subject: 'Discrete Structures for Computer Science',
          rooms: 'CSE Lecture Halls',
        },
        '3rd_ds': {
          code: 'DSN 3004',
          subject: 'Computer Networks',
          rooms: 'CSE Lecture Halls',
        },
        '3rd_ai': {
          code: 'AIN 3004',
          subject: 'Mathematical Foundations of AI',
          rooms: 'CSE Lecture Halls',
        },
        '7th_cse': {
          code: 'CSO 1002',
          subject: 'Open Elective-1: Computer Networks (CSO1002-CN)',
          rooms: 'DH1, DH2, L26 - L29 (57)',
        },
        '7th_ds': {
          code: 'CSO 1002',
          subject: 'Open Elective-1: Computer Networks (CSO1002-CN)',
          rooms: 'DH1, DH2, L26 - L29',
        },
        '7th_ai': {
          code: 'CSO 1002',
          subject: 'Open Elective-1: Computer Networks (CSO1002-CN)',
          rooms: 'DH1, DH2, L26 - L29',
        },
      },
    },
  ],
};

export const fetchDatesheet = async (classId?: number | null): Promise<DatesheetData> => {
  try {
    const url = classId ? `/datesheet?class_id=${classId}` : '/datesheet';
    const res = await api.get(url);
    if (res.data?.data) {
      return res.data.data;
    }
    return OFFLINE_FALLBACK_DATESHEET;
  } catch (error) {
    console.log('Serving bundled offline datesheet fallback');
    return OFFLINE_FALLBACK_DATESHEET;
  }
};

/**
 * Deduce student's exact branch_key from user courseClass metadata
 */
export const detectUserBranchKey = (user: any): string => {
  const group = (user?.courseClass?.group_name || '').toUpperCase();
  const branch = (user?.courseClass?.branch?.name || '').toUpperCase();
  const code = (user?.courseClass?.branch?.code || '').toUpperCase();

  if (group.includes('AI') || branch.includes('ARTIFICIAL') || code.includes('AI')) {
    if (group.includes('5') || group.includes('3RD YEAR')) return '5th_ai';
    if (group.includes('7') || group.includes('4TH YEAR')) return '7th_ai';
    return '3rd_ai';
  }
  if (group.includes('DS') || branch.includes('DATA') || code.includes('DS')) {
    if (group.includes('5') || group.includes('3RD YEAR')) return '5th_ds';
    if (group.includes('7') || group.includes('4TH YEAR')) return '7th_ds';
    return '3rd_ds';
  }
  if (branch.includes('COMPUTER') || code.includes('CSE')) {
    if (group.includes('5') || group.includes('3RD YEAR')) return '5th_cse';
    if (group.includes('7') || group.includes('4TH YEAR')) return '7th_cse';
    return '3rd_cse';
  }
  return '3rd_cse';
};

