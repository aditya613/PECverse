import { api } from './api';

export interface ClassExam {
  code: string;
  subject: string;
  rooms?: string;
  coordinator?: string | null;
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
  is_covered_branch?: boolean;
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
  notice_message?: string | null;
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
  notice_no: 'PEC/CSE/326',
  notice_date: '2026-11-20',
  title: 'CSE Department Datesheet for End Term Examinations (Revision II)',
  period: '26th November – 5th December 2026',
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
  ],
  instructions: [
    'Students must occupy their allotted seats 15 minutes before exam commencement.',
    'Institute Identity Card and End-Term Admit Card are strictly mandatory.',
    'Mobile phones, smartwatches, and programmable calculators are prohibited in exam halls.',
    'Seating centers (DH1 to DH5, L10, L26 to L31) are marked by department coordination.',
    'Backlog papers of 1st-semester courses for 3rd-semester students will be held as per the central datesheet.',
  ],
  schedule: [
    // 26/11/2026 (Thursday) Morning
    {
      id: 'slot_1',
      date: '2026-11-26',
      day: 'Thursday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      coordinator: 'Dr. Neeraj (DSCS) / Dr. Suraj Srivastava (CSO1003-DAIR)',
      classes: {
        '3rd_cse': {
          code: 'CTN 303',
          subject: 'Discrete Structures for Computer Science',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Neeraj (DSCS)',
        },
        '3rd_ds': {
          code: 'DSN 3004',
          subject: 'Computer Networks',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Neeraj (DSCS)',
        },
        '3rd_ai': {
          code: 'AIN 3004',
          subject: 'Mathematical Foundations of AI',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Neeraj (DSCS)',
        },
        '7th_cse': {
          code: 'Open Elective-1',
          subject: 'Open Elective-I (CSO1002-CN / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T1, L8, L9 & Dept Classrooms',
          coordinator: 'Dr. Suraj Srivastava (CSO1003-DAIR)',
          note: 'CEO1001, CHO004, EEO1001, EEO1002, MCO1001, MMO1003, MMO1004, PRO1009, PYO001, CSO1002-CN',
        },
        '7th_ds': {
          code: 'Open Elective-1',
          subject: 'Open Elective-I (CSO1002-CN / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T1, L8, L9 & Dept Classrooms',
          coordinator: 'Dr. Suraj Srivastava (CSO1003-DAIR)',
        },
        '7th_ai': {
          code: 'Open Elective-1',
          subject: 'Open Elective-I (CSO1002-CN / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T1, L8, L9 & Dept Classrooms',
          coordinator: 'Dr. Suraj Srivastava (CSO1003-DAIR)',
        },
      },
    },
    // 26/11/2026 (Thursday) Evening
    {
      id: 'slot_2',
      date: '2026-11-26',
      day: 'Thursday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      coordinator: 'Dr. Dipika Gupta (SC)',
      classes: {
        '5th_cse': {
          code: 'CSN 5002',
          subject: 'Soft Computing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Dipika Gupta (SC)',
        },
        '5th_ds': {
          code: 'DSN 5002',
          subject: 'Analytical Tools for Data Science',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Dipika Gupta (SC)',
        },
        '5th_ai': {
          code: 'AIN 5002',
          subject: 'Deep Learning',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Dipika Gupta (SC)',
        },
      },
    },
    // 27/11/2026 (Friday) Morning
    {
      id: 'slot_3',
      date: '2026-11-27',
      day: 'Friday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      coordinator: 'Dr. Navdeep (DL)',
      classes: {
        '7th_cse': {
          code: 'CSE 1007',
          subject: 'Deep Learning',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Navdeep (DL)',
        },
        '7th_ds': {
          code: 'DSE 1011',
          subject: 'Data & Internet Security',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Navdeep (DL)',
        },
        '7th_ai': {
          code: 'AIE 1008',
          subject: 'Computer Vision & Image Processing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Navdeep (DL)',
        },
      },
    },
    // 28/11/2026 (Saturday) Morning
    {
      id: 'slot_4',
      date: '2026-11-28',
      day: 'Saturday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      coordinator: 'Dr. Satnam Kaur (OOP)',
      classes: {
        '3rd_cse': {
          code: 'CTN 304',
          subject: 'Object Oriented Programming',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
        '3rd_ds': {
          code: 'DSN 3003',
          subject: 'Operating Systems',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
        '3rd_ai': {
          code: 'AIN 3002',
          subject: 'Object Oriented Programming',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
        '7th_cse': {
          code: 'CSE 1009',
          subject: 'Wireless & Mobile Networks',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
        '7th_ds': {
          code: 'DSE 1009',
          subject: 'Wireless & Mobile Networks',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
        '7th_ai': {
          code: 'AIE 1009',
          subject: 'Natural Language Processing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Satnam Kaur (OOP)',
        },
      },
    },
    // 28/11/2026 (Saturday) Evening
    {
      id: 'slot_5',
      date: '2026-11-28',
      day: 'Saturday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      coordinator: 'Dr. Shilpa (DBMS)',
      classes: {
        '5th_cse': {
          code: 'CSN 5004',
          subject: 'Database Management Systems',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Shilpa (DBMS)',
        },
        '5th_ds': {
          code: 'DSN 5004',
          subject: 'Internet of Things',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Shilpa (DBMS)',
        },
        '5th_ai': {
          code: 'AIN 5004',
          subject: 'Computer Networks',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Shilpa (DBMS)',
        },
      },
    },
    // 30/11/2026 (Monday) Morning
    {
      id: 'slot_6',
      date: '2026-11-30',
      day: 'Monday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      coordinator: 'Mayank Gupta (CTN301)',
      classes: {
        '3rd_cse': {
          code: 'CTN 301',
          subject: 'Data Structures',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Mayank Gupta (CTN301)',
        },
        '3rd_ds': {
          code: 'DSN 3001',
          subject: 'Data Structures',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Mayank Gupta (CTN301)',
        },
        '3rd_ai': {
          code: 'AIN 3001',
          subject: 'Data Structures',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Mayank Gupta (CTN301)',
        },
        '7th_cse': {
          code: 'Open Elective-2',
          subject: 'Open Elective-2 (CSO1003-DAIR / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T7, DH3, DH4, T8, T3, T4, L8, L9, DH5 & Dept Classrooms',
          coordinator: 'Mayank Gupta (CTN301)',
        },
        '7th_ds': {
          code: 'Open Elective-2',
          subject: 'Open Elective-2 (CSO1003-DAIR / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T7, DH3, DH4, T8, T3, T4, L8, L9, DH5 & Dept Classrooms',
          coordinator: 'Mayank Gupta (CTN301)',
        },
        '7th_ai': {
          code: 'Open Elective-2',
          subject: 'Open Elective-2 (CSO1003-DAIR / Dept Electives)',
          rooms: 'L1, L2, L3, DH1-DH5, T7, DH3, DH4, T8, T3, T4, L8, L9, DH5 & Dept Classrooms',
          coordinator: 'Mayank Gupta (CTN301)',
        },
      },
    },
    // 30/11/2026 (Monday) Evening
    {
      id: 'slot_7',
      date: '2026-11-30',
      day: 'Monday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      coordinator: 'Dr. Tejinder Kaur (SE)',
      classes: {
        '5th_cse': {
          code: 'CSN 5003',
          subject: 'Software Engineering',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Tejinder Kaur (SE)',
        },
        '5th_ds': {
          code: 'DSN 5003',
          subject: 'Software Engineering',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Tejinder Kaur (SE)',
        },
        '5th_ai': {
          code: 'AIN 5003',
          subject: 'Human Machine Interaction',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Tejinder Kaur (SE)',
        },
      },
    },
    // 01/12/2026 (Tuesday) Morning - Minors 3rd Year
    {
      id: 'slot_8',
      date: '2026-12-01',
      day: 'Tuesday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      classes: {
        '5th_cse': {
          code: 'CSM1003',
          subject: 'Minor: DBMS (Database Management Systems)',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'MSC (B.Tech 3rd year)',
        },
        '5th_ds': {
          code: 'DSM1003',
          subject: 'Minor: ATDS (Analytical Tools for Data Science)',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'MSC (B.Tech 3rd year)',
        },
        '5th_ai': {
          code: 'AIM1003',
          subject: 'Minor: HMI (Human Machine Interface)',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'MSC (B.Tech 3rd year)',
        },
      },
    },
    // 01/12/2026 (Tuesday) Evening
    {
      id: 'slot_9',
      date: '2026-12-01',
      day: 'Tuesday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      classes: {
        '7th_cse': {
          code: 'CSE 1013',
          subject: 'Digital Image Processing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
        },
        '7th_ds': {
          code: 'DSE 1013',
          subject: 'Digital Image Processing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
        },
      },
    },
    // 02/12/2026 (Wednesday) Morning - Minors 2nd Year
    {
      id: 'slot_10',
      date: '2026-12-02',
      day: 'Wednesday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      classes: {
        '3rd_cse': {
          code: 'CSM1001',
          subject: 'Minor: OOP (Object Oriented Programming)',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'Minor Specialization Courses (B.Tech 2nd year)',
        },
        '3rd_ds': {
          code: 'DSM1001',
          subject: 'Minor: Python for DS',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'Minor Specialization Courses (B.Tech 2nd year)',
        },
        '3rd_ai': {
          code: 'AIM1001',
          subject: 'Minor: MFAI (Mathematical Foundations of AI)',
          rooms: 'Respective Department Classroom',
          is_minor: true,
          note: 'Minor Specialization Courses (B.Tech 2nd year)',
        },
      },
    },
    // 02/12/2026 (Wednesday) Evening
    {
      id: 'slot_11',
      date: '2026-12-02',
      day: 'Wednesday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      coordinator: 'Dr. Vivek Dabra (CSE1010)',
      classes: {
        '7th_cse': {
          code: 'CSE 1010',
          subject: 'Cloud Computing',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Vivek Dabra (CSE1010)',
        },
        '7th_ds': {
          code: 'DSE 1010',
          subject: 'Advances of Intelligent & Learning Agents',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Vivek Dabra (CSE1010)',
        },
      },
    },
    // 03/12/2026 (Thursday) Morning
    {
      id: 'slot_12',
      date: '2026-12-03',
      day: 'Thursday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      coordinator: 'Dr. Amanpreet Singh (CTN302)',
      classes: {
        '3rd_cse': {
          code: 'CTN 302',
          subject: 'Data Science & Machine Learning',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
        '3rd_ds': {
          code: 'DSN 3002',
          subject: 'Python for Data Science',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
        '3rd_ai': {
          code: 'AIN 3003',
          subject: 'Data Science & Machine Learning',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
        '7th_cse': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4001 / MHN4002 / MHN4003',
          rooms: 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31 (493)',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
        '7th_ds': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4001 / MHN4002 / MHN4003',
          rooms: 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31 (493)',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
        '7th_ai': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4001 / MHN4002 / MHN4003',
          rooms: 'DH1, DH2, DH3, DH4, L10, L26, L27, L28, L29, L30, L31 (493)',
          coordinator: 'Dr. Amanpreet Singh (CTN302)',
        },
      },
    },
    // 03/12/2026 (Thursday) Evening
    {
      id: 'slot_13',
      date: '2026-12-03',
      day: 'Thursday',
      time: '2:00 PM - 5:00 PM',
      start_time: '14:00',
      end_time: '17:00',
      coordinator: 'Dr. Sandeep Harit (CSN5001)',
      classes: {
        '5th_cse': {
          code: 'CSN 5001',
          subject: 'Theory of Computation (TOC)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Sandeep Harit (CSN5001)',
        },
        '5th_ds': {
          code: 'DSN 5001',
          subject: 'Data Acquisition & Information Retrieval',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Sandeep Harit (CSN5001)',
        },
        '5th_ai': {
          code: 'AIN 5001',
          subject: 'Theory of Computation (TOC)',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26, L27, L28, L29, L30, L31',
          coordinator: 'Dr. Sandeep Harit (CSN5001)',
        },
      },
    },
    // 04/12/2026 (Friday) Morning
    {
      id: 'slot_14',
      date: '2026-12-04',
      day: 'Friday',
      time: '9:30 AM - 12:30 PM',
      start_time: '09:30',
      end_time: '12:30',
      classes: {
        '7th_cse': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4004 / MHN4005',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26 (299)',
        },
        '7th_ds': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4004 / MHN4005',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26 (299)',
        },
        '7th_ai': {
          code: 'HSM-III',
          subject: 'HSM-III: MHN4004 / MHN4005',
          rooms: 'DH1, DH2, DH3, DH4, DH5, L26 (299)',
        },
      },
    },
  ],
};

let cachedDatesheet: DatesheetData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const datesheetApi = {
  /**
   * Fetch complete datesheet and personalized schedule with smart fallback.
   */
  async getDatesheet(classId?: number, forceRefresh = false): Promise<DatesheetData> {
    const now = Date.now();
    if (!forceRefresh && cachedDatesheet && now - lastFetchTime < CACHE_TTL_MS) {
      if (classId && (!cachedDatesheet.user_mapping || cachedDatesheet.user_mapping.class_info?.class_id !== classId)) {
        // Recalculate local mapping
        return {
          ...cachedDatesheet,
          user_mapping: datesheetApi.computeLocalUserMapping(classId, cachedDatesheet.schedule),
        };
      }
      return cachedDatesheet;
    }

    try {
      const url = classId ? `/datesheet?class_id=${classId}` : '/datesheet';
      const response = await api.get<DatesheetResponse>(url);

      if (response?.data?.status === 'success' && response?.data?.data) {
        cachedDatesheet = response.data.data;
        lastFetchTime = now;
        return cachedDatesheet;
      }
    } catch {
      // Backend request failed, use offline fallback
    }

    // Build offline fallback
    const fallback = { ...OFFLINE_FALLBACK_DATESHEET };
    if (classId) {
      fallback.user_mapping = datesheetApi.computeLocalUserMapping(classId, fallback.schedule);
    }
    cachedDatesheet = fallback;
    return fallback;
  },

  /**
   * Compute localized user exams if offline or unauthenticated
   */
  computeLocalUserMapping(classId: number, schedule: ExamSlot[]): UserClassMapping {
    // Map classId to branch key
    let branchKey = '3rd_cse';
    let year = 2;
    let branchCode = 'CSE';
    let branchName = 'Computer Science & Engineering';
    let groupName = 'G1';

    if (classId === 8 || classId === 9) {
      branchKey = '3rd_cse';
      year = 2;
      groupName = classId === 8 ? 'G1' : 'G2';
    } else if (classId === 10) {
      branchKey = '3rd_ds';
      year = 2;
      branchCode = 'DS';
      branchName = 'Data Science';
      groupName = 'DS';
    } else if (classId === 11) {
      branchKey = '3rd_ai';
      year = 2;
      branchCode = 'AI';
      branchName = 'Artificial Intelligence';
      groupName = 'AI';
    } else if (classId === 46 || classId === 47) {
      branchKey = '5th_cse';
      year = 3;
      groupName = classId === 46 ? 'G1' : 'G2';
    } else if (classId === 45) {
      branchKey = '5th_ds';
      year = 3;
      branchCode = 'DS';
      branchName = 'Data Science';
      groupName = 'DS';
    } else if (classId === 44) {
      branchKey = '5th_ai';
      year = 3;
      branchCode = 'AI';
      branchName = 'Artificial Intelligence';
      groupName = 'AI';
    } else if (classId === 43) {
      branchKey = '7th_cse';
      year = 4;
      groupName = 'CSE';
    } else if (classId === 42) {
      branchKey = '7th_ds';
      year = 4;
      branchCode = 'DS';
      branchName = 'Data Science';
      groupName = 'DS';
    } else if (classId === 41) {
      branchKey = '7th_ai';
      year = 4;
      branchCode = 'AI';
      branchName = 'Artificial Intelligence';
      groupName = 'AI';
    }

    const myExams: PersonalizedExam[] = [];
    const backlogExams: PersonalizedExam[] = [];
    const minorExams: PersonalizedExam[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    schedule.forEach((slot, idx) => {
      const classExam = slot.classes[branchKey];
      if (!classExam) return;

      const examDate = slot.date;
      const daysUntil = Math.ceil((new Date(examDate).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));

      const examObj: PersonalizedExam = {
        id: `${slot.id}_${branchKey}_${idx}`,
        exam_date: slot.date,
        day_name: slot.day,
        time_slot: slot.time,
        start_time: slot.start_time,
        end_time: slot.end_time,
        branch_key: branchKey,
        semester: branchKey.startsWith('3rd') ? '3rd Sem' : branchKey.startsWith('5th') ? '5th Sem' : '7th Sem',
        branch_name: branchName,
        subject_code: classExam.code,
        subject_name: classExam.subject,
        seating_rooms: classExam.rooms,
        coordinator_duty: classExam.coordinator || slot.coordinator || undefined,
        is_backlog: !!classExam.is_backlog,
        is_minor: !!classExam.is_minor,
        notes: classExam.note,
        days_until: daysUntil,
      };

      if (examObj.is_backlog) {
        backlogExams.push(examObj);
      } else if (examObj.is_minor) {
        minorExams.push(examObj);
      } else {
        myExams.push(examObj);
      }
    });

    return {
      has_mapping: true,
      is_covered_branch: true,
      branch_key: branchKey,
      class_info: {
        class_id: classId,
        year,
        group_name: groupName,
        branch_code: branchCode,
        branch_name: branchName,
      },
      my_exams: myExams,
      backlog_exams: backlogExams,
      minor_exams: minorExams,
    };
  },

  /**
   * Find the next upcoming exam for an authenticated student
   */
  getNextExam(exams: PersonalizedExam[]): PersonalizedExam | null {
    if (!exams || exams.length === 0) return null;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Filter exams that are today or in the future
    const upcoming = exams
      .filter((e) => e.exam_date >= todayStr)
      .sort((a, b) => a.exam_date.localeCompare(b.exam_date) || a.start_time.localeCompare(b.start_time));

    return upcoming[0] || null;
  },

  /**
   * Format human-friendly countdown to exam date
   */
  getCountdownText(examDate: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(examDate);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays === -1) return 'Yesterday';
    return `${Math.abs(diffDays)} days ago`;
  },
};


export const fetchDatesheet = async (classId?: number | null): Promise<DatesheetData> => {
  return datesheetApi.getDatesheet(classId ?? undefined);
};

export const detectUserBranchKey = (user: any): string => {
  const year = user?.courseClass?.year;
  const group = (user?.courseClass?.group_name || '').toUpperCase();
  const branch = (user?.courseClass?.branch?.name || '').toUpperCase();
  const code = (user?.courseClass?.branch?.code || '').toUpperCase();

  if (year === 1) return '1st_sem';

  if (group.includes('AI') || branch.includes('ARTIFICIAL') || code.includes('AI')) {
    if (year === 3 || group.includes('5') || group.includes('3RD YEAR')) return '5th_ai';
    if (year === 4 || group.includes('7') || group.includes('4TH YEAR')) return '7th_ai';
    return '3rd_ai';
  }
  if (group.includes('DS') || branch.includes('DATA') || code.includes('DS')) {
    if (year === 3 || group.includes('5') || group.includes('3RD YEAR')) return '5th_ds';
    if (year === 4 || group.includes('7') || group.includes('4TH YEAR')) return '7th_ds';
    return '3rd_ds';
  }
  if (branch.includes('COMPUTER') || code.includes('CSE')) {
    if (year === 3 || group.includes('5') || group.includes('3RD YEAR')) return '5th_cse';
    if (year === 4 || group.includes('7') || group.includes('4TH YEAR')) return '7th_cse';
    return '3rd_cse';
  }
  return '3rd_cse';
};
