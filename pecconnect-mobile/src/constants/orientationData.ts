export type BranchCode = 
  | 'CSE' | 'ECE' | 'VLSI' | 'B.Design' | 'AERO' 
  | 'Electrical' | 'Civil' | 'AI' | 'DS' | 'M and C' 
  | 'Mechanical' | 'Metallurgy' | 'Production';

export const BRANCH_DATA: Record<BranchCode, {
  group: string;
  tech: string;
  sports: string;
  cultural: string;
  day1_attendance: string;
  day1_dept_visit: string;
  day2_attendance: string;
  day3_attendance?: string;
}> = {
  'CSE': { group: 'Group A', tech: 'T1', sports: 'S3', cultural: 'A1', day1_attendance: 'Auditorium', day1_dept_visit: 'Auditorium', day2_attendance: 'L-26', day3_attendance: 'Aero Auditorium' },
  'ECE': { group: 'Group B', tech: 'T3', sports: 'S1', cultural: 'A1', day1_attendance: 'Auditorium', day1_dept_visit: 'Aero Auditorium', day2_attendance: 'L-27', day3_attendance: 'L-26' },
  'VLSI': { group: 'Group C', tech: 'T1', sports: 'S4', cultural: 'A1', day1_attendance: 'Auditorium', day1_dept_visit: 'Aero Auditorium', day2_attendance: 'L-28', day3_attendance: 'L-27' },
  'B.Design': { group: 'Group C', tech: 'T1', sports: 'S4', cultural: 'A1', day1_attendance: 'L-31', day1_dept_visit: 'L-17', day2_attendance: 'L-28', day3_attendance: 'L-27' },
  'AERO': { group: 'Group C', tech: 'T2', sports: 'S4', cultural: 'A3', day1_attendance: 'L-31', day1_dept_visit: 'Seminar Hall, Aero Dept', day2_attendance: 'L-28', day3_attendance: 'L-27' },
  'Electrical': { group: 'Group D', tech: 'T4', sports: 'S2', cultural: 'A3', day1_attendance: 'L-27', day1_dept_visit: 'L-27', day2_attendance: 'L-29', day3_attendance: 'L-28' },
  'Civil': { group: 'Group E', tech: 'T3', sports: 'S1', cultural: 'A2', day1_attendance: 'L-26', day1_dept_visit: 'L-26', day2_attendance: 'Auditorium', day3_attendance: 'L-29' },
  'AI': { group: 'Group F', tech: 'T2', sports: 'S4', cultural: 'A3', day1_attendance: 'L-29', day1_dept_visit: 'Auditorium', day2_attendance: 'Aero Auditorium', day3_attendance: 'L-30' },
  'DS': { group: 'Group F', tech: 'T2', sports: 'S4', cultural: 'A3', day1_attendance: 'L-29', day1_dept_visit: 'Auditorium', day2_attendance: 'Aero Auditorium', day3_attendance: 'L-30' },
  'M and C': { group: 'Group F', tech: 'T2', sports: 'S3', cultural: 'A2', day1_attendance: 'L-29', day1_dept_visit: 'Mathematics Lab near T5', day2_attendance: 'Aero Auditorium', day3_attendance: 'L-30' },
  'Mechanical': { group: 'Group G', tech: 'T2', sports: 'S3', cultural: 'A2', day1_attendance: 'L-28', day1_dept_visit: 'L-28', day2_attendance: 'L-30', day3_attendance: 'Auditorium' },
  'Metallurgy': { group: 'Group H', tech: 'T4', sports: 'S2', cultural: 'A3', day1_attendance: 'L-30', day1_dept_visit: 'Seminar Hall, MMED', day2_attendance: 'L-31', day3_attendance: 'L-31' },
  'Production': { group: 'Group H', tech: 'T1', sports: 'S2', cultural: 'A2', day1_attendance: 'L-30', day1_dept_visit: 'L-17', day2_attendance: 'L-31', day3_attendance: 'L-31' }
};

export const DAY2_CLUBS_SLOT1: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'HEB', venue: 'L-26' },
  'Group B': { club: 'EEB', venue: 'L-27' },
  'Group C': { club: 'SAASC', venue: 'L-28' },
  'Group D': { club: 'ACM', venue: 'L-29' },
  'Group E': { club: 'PDC', venue: 'Auditorium' },
  'Group F': { club: 'WEC', venue: 'Aero Audi' },
  'Group G': { club: 'NCC', venue: 'L-30' },
  'Group H': { club: 'Robotics', venue: 'L-31' }
};

export const DAY2_CLUBS_SLOT2: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'SAE', venue: 'L-26' },
  'Group B': { club: 'ASCE', venue: 'L-27' },
  'Group C': { club: 'SME', venue: 'L-28' },
  'Group D': { club: 'CIM', venue: 'L-29' },
  'Group E': { club: 'EEB', venue: 'Auditorium' },
  'Group F': { club: 'ASME', venue: 'Aero Audi' },
  'Group G': { club: 'APC', venue: 'L-30' },
  'Group H': { club: 'SESI', venue: 'L-31' }
};

export const DAY2_CLUBS_SLOT3: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'Rotaract', venue: 'L-26' },
  'Group B': { club: 'ELC', venue: 'L-27' },
  'Group C': { club: 'ASPS', venue: 'L-28' },
  'Group D': { club: 'ATS', venue: 'L-29' },
  'Group E': { club: 'IIM', venue: 'Auditorium' },
  'Group F': { club: 'IEEE', venue: 'Aero Audi' },
  'Group G': { club: 'NSS', venue: 'L-30' },
  'Group H': { club: 'IGS', venue: 'L-31' }
};

export const DAY2_CLUBS_SLOT4: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'ELC', venue: 'L-26' },
  'Group B': { club: 'ASPS', venue: 'L-27' },
  'Group C': { club: 'ATS', venue: 'L-28' },
  'Group D': { club: 'IIM', venue: 'L-29' },
  'Group E': { club: 'IEEE', venue: 'Auditorium' },
  'Group F': { club: 'NSS', venue: 'Aero Audi' },
  'Group G': { club: 'IGS', venue: 'L-30' },
  'Group H': { club: 'ES', venue: 'L-31' }
};

export const DAY3_CLUBS_SLOT1: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'Robotics', venue: 'L-26' },
  'Group B': { club: 'HEB', venue: 'Aero Audi' },
  'Group C': { club: 'EEB', venue: 'L-27' },
  'Group D': { club: 'SAASC', venue: 'L-28' },
  'Group E': { club: 'ACM', venue: 'L-29' },
  'Group F': { club: 'EIC', venue: 'L-30' },
  'Group G': { club: 'WEC', venue: 'Auditorium' },
  'Group H': { club: 'NCC', venue: 'L-31' }
};

export const DAY3_CLUBS_SLOT2: Record<string, { club: string, venue: string }> = {
  'Group A': { club: 'SCC', venue: 'L-26' },
  'Group B': { club: 'SAE', venue: 'Aero Audi' },
  'Group C': { club: 'PDC', venue: 'L-27' },
  'Group D': { club: 'SME', venue: 'L-28' },
  'Group E': { club: 'CIM', venue: 'L-29' },
  'Group F': { club: 'ASCE', venue: 'L-30' },
  'Group G': { club: 'Robotics', venue: 'Auditorium' },
  'Group H': { club: 'APC', venue: 'L-31' }
};
