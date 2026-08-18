import { useMemo } from 'react';
import { BRANCH_DATA, BranchCode, DAY2_CLUBS_SLOT1, DAY2_CLUBS_SLOT2, DAY2_CLUBS_SLOT3, DAY2_CLUBS_SLOT4, DAY3_CLUBS_SLOT1, DAY3_CLUBS_SLOT2 } from '@/constants/orientationData';

export interface ScheduleEvent {
  time: string;
  duration: string;
  event: string;
  venue: string;
  type: 'admin' | 'fun' | 'ceremony' | 'logistics' | 'break' | 'academic' | 'club';
  icon: string;
}

export function useOrientationSchedule(branch: string | undefined | null) {
  return useMemo(() => {
    // If no branch is provided or an invalid one, use fallback strings
    const isValidBranch = branch && branch in BRANCH_DATA;
    const branchInfo = isValidBranch ? BRANCH_DATA[branch as BranchCode] : null;

    const day1: ScheduleEvent[] = [
      { time: '09:30 AM', duration: '30 min', event: 'Attendance & Reporting', venue: branchInfo ? branchInfo.day1_attendance : 'Respective Venues', type: 'admin', icon: 'shield-checkmark' },
      { time: '10:00 AM', duration: '30 min', event: 'Welcome Kit Distribution', venue: 'Auditorium', type: 'fun', icon: 'gift' },
      { time: '10:30 AM', duration: '05 min', event: 'Welcoming the Batch of 2030', venue: 'Auditorium', type: 'ceremony', icon: 'sparkles' },
      { time: '10:35 AM', duration: '05 min', event: 'Inaugural & Lamp Lighting', venue: 'Auditorium', type: 'ceremony', icon: 'flame' },
      { time: '10:40 AM', duration: '05 min', event: 'Know Your Director', venue: 'Auditorium', type: 'ceremony', icon: 'person' },
      { time: '10:45 AM', duration: '20 min', event: 'Address By Director', venue: 'Auditorium', type: 'ceremony', icon: 'mic' },
      { time: '11:05 AM', duration: '10 min', event: 'Intro to Heads, Deans, Registrar', venue: 'Auditorium', type: 'admin', icon: 'people' },
      { time: '11:15 AM', duration: '20 min', event: 'Address By DAA', venue: 'Auditorium', type: 'admin', icon: 'school' },
      { time: '11:35 AM', duration: '15 min', event: 'Address By DSA', venue: 'Auditorium', type: 'admin', icon: 'person' },
      { time: '11:50 AM', duration: '15 min', event: 'Address By Head, Computer Centre', venue: 'Auditorium', type: 'admin', icon: 'desktop' },
      { time: '12:05 PM', duration: '25 min', event: 'Dispersal Of Students', venue: 'Respective Hostels', type: 'logistics', icon: 'walk' },
      { time: '12:30 PM', duration: '75 min', event: 'Lunch Break', venue: 'Centenary Hall (Day Scholars) / Hostels (Hostellers)', type: 'break', icon: 'restaurant' },
      { time: '01:45 PM', duration: '10 min', event: 'Documentary Video', venue: 'Auditorium', type: 'fun', icon: 'videocam' },
      { time: '01:55 PM', duration: '05 min', event: 'Introduction to Director, IIT Ropar', venue: 'Auditorium', type: 'ceremony', icon: 'people' },
      { time: '02:00 PM', duration: '60 min', event: 'Address By Prof. Rajeev Ahuja', venue: 'Auditorium', type: 'ceremony', icon: 'mic' },
      { time: '03:00 PM', duration: '10 min', event: 'Felicitation Ceremony', venue: 'Auditorium', type: 'ceremony', icon: 'ribbon' },
      { time: '03:10 PM', duration: '05 min', event: 'Vote of Thanks', venue: 'Auditorium', type: 'ceremony', icon: 'heart' },
      { time: '03:30 PM', duration: '60 min', event: 'Department Visit(s)', venue: branchInfo ? branchInfo.day1_dept_visit : 'Respective Departments', type: 'academic', icon: 'business' },
      { time: '04:30 PM', duration: '30 min', event: 'Evening Snacks', venue: branchInfo ? branchInfo.day1_dept_visit : 'Respective Departments', type: 'break', icon: 'cafe' },
      { time: '05:00 PM', duration: '30 min', event: 'Institute Tour', venue: 'Campus', type: 'fun', icon: 'map' }
    ];

    const day2: ScheduleEvent[] = [
      { time: '08:45 AM', duration: '30 min', event: 'Attendance & Reporting', venue: branchInfo ? branchInfo.day2_attendance : 'Respective Venues', type: 'admin', icon: 'shield-checkmark' },
      { time: '09:15 AM', duration: '10 min', event: 'Address by Head, Physics', venue: 'Auditorium', type: 'academic', icon: 'flask' },
      { time: '09:25 AM', duration: '10 min', event: 'Address by Head, Chemistry', venue: 'Auditorium', type: 'academic', icon: 'flask' },
      { time: '09:35 AM', duration: '10 min', event: 'Address by Head, Mathematics', venue: 'Auditorium', type: 'academic', icon: 'calculator' },
      { time: '09:45 AM', duration: '10 min', event: 'Address by Head, CMH', venue: 'Auditorium', type: 'academic', icon: 'book' },
      { time: '09:55 AM', duration: '45 min', event: 'Speaker Session', venue: 'Auditorium', type: 'academic', icon: 'mic' },
      { time: '10:40 AM', duration: '15 min', event: 'Address by ADSA, Cultural', venue: 'Auditorium', type: 'admin', icon: 'musical-notes' },
      { time: '10:55 AM', duration: '15 min', event: 'Address by ADSA, Technical', venue: 'Auditorium', type: 'admin', icon: 'hardware-chip' },
      { time: '11:10 AM', duration: '20 min', event: 'Address by ADSA Hostels (Anti-ragging)', venue: 'Auditorium', type: 'admin', icon: 'shield' },
      { time: '11:30 AM', duration: '10 min', event: 'Intro to P/Is Clubs & Societies', venue: 'Auditorium', type: 'admin', icon: 'people' },
      { time: '11:40 AM', duration: '05 min', event: 'Vote of Thanks', venue: 'Auditorium', type: 'ceremony', icon: 'heart' },
      { time: '11:45 AM', duration: '30 min', 
        event: branchInfo ? `Club Introduction: ${DAY2_CLUBS_SLOT1[branchInfo.group]?.club || 'Clubs'}` : 'Club Introductions', 
        venue: branchInfo ? (DAY2_CLUBS_SLOT1[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'people-circle' 
      },
      { time: '12:15 PM', duration: '30 min', 
        event: branchInfo ? `Club Introduction: ${DAY2_CLUBS_SLOT2[branchInfo.group]?.club || 'Clubs'}` : 'Club Introductions', 
        venue: branchInfo ? (DAY2_CLUBS_SLOT2[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'people-circle' 
      },
      { time: '12:45 PM', duration: '90 min', event: 'Lunch Break', venue: 'Centenary Hall (Day Scholars) / Hostels (Hostellers)', type: 'break', icon: 'restaurant' },
      { time: '02:15 PM', duration: '15 min', event: 'Movement of Students', venue: 'Respective Venues', type: 'logistics', icon: 'walk' },
      { time: '02:30 PM', duration: '30 min', 
        event: branchInfo ? `Society Session: ${DAY2_CLUBS_SLOT3[branchInfo.group]?.club || 'Societies'}` : 'Society Sessions', 
        venue: branchInfo ? (DAY2_CLUBS_SLOT3[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'color-palette' 
      },
      { time: '03:00 PM', duration: '30 min', 
        event: branchInfo ? `Society Session: ${DAY2_CLUBS_SLOT4[branchInfo.group]?.club || 'Societies'}` : 'Society Sessions', 
        venue: branchInfo ? (DAY2_CLUBS_SLOT4[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'color-palette' 
      },
      { time: '03:30 PM', duration: '30 min', event: 'Evening Snacks', venue: 'Respective Venues', type: 'break', icon: 'cafe' },
      { time: '04:00 PM', duration: '15 min', event: 'Movement of Students', venue: 'Respective Venues', type: 'logistics', icon: 'walk' },
    ];

    // Handle 4:15 PM - 5:45 PM conditional events for Day 2
    if (branchInfo) {
      if (branchInfo.tech === 'T1') {
        day2.push({ time: '04:15 PM', duration: '90 min', event: 'Technical Display', venue: 'Centenary Hall', type: 'academic', icon: 'hardware-chip' });
      } else if (branchInfo.sports === 'S1') {
        day2.push({ time: '04:15 PM', duration: '90 min', event: 'Sports Activities', venue: 'Athletic Ground', type: 'fun', icon: 'football' });
      } else if (branchInfo.cultural === 'A3') {
        day2.push({ time: '04:15 PM', duration: '90 min', event: 'Music Session (Cultural)', venue: 'Auditorium', type: 'fun', icon: 'musical-notes' });
      } else {
        day2.push({ time: '04:15 PM', duration: '90 min', event: 'Free Time / Dispersal', venue: 'Campus', type: 'logistics', icon: 'walk' });
      }
    } else {
      day2.push({ time: '04:15 PM', duration: '90 min', event: 'Tech / Sports / Cultural Activities', venue: 'Various Venues (Check Group)', type: 'fun', icon: 'star' });
    }

    const day3: ScheduleEvent[] = [
      { time: '08:30 AM', duration: '45 min', event: 'Attendance & Reporting', venue: branchInfo?.day3_attendance || 'Respective Venues', type: 'admin', icon: 'shield-checkmark' },
      { time: '09:15 AM', duration: '15 min', event: 'Address by Head, SCC', venue: 'Auditorium', type: 'academic', icon: 'people' },
      { time: '09:30 AM', duration: '15 min', event: 'Address By Head, Alumni Relations', venue: 'Auditorium', type: 'academic', icon: 'briefcase' },
      { time: '09:45 AM', duration: '15 min', event: 'Address by Head, Library', venue: 'Auditorium', type: 'academic', icon: 'book' },
      { time: '10:00 AM', duration: '20 min', event: 'Address by Head, CDGC', venue: 'Auditorium', type: 'academic', icon: 'business' },
      { time: '10:20 AM', duration: '60 min', event: 'Speaker Session', venue: 'Auditorium', type: 'academic', icon: 'mic' },
      { time: '11:20 AM', duration: '60 min', event: 'Speaker Session', venue: 'Auditorium', type: 'academic', icon: 'mic' },
      { time: '12:20 PM', duration: '10 min', event: 'Felicitation and Vote of Thanks', venue: 'Auditorium', type: 'ceremony', icon: 'ribbon' },
      { time: '12:30 PM', duration: '15 min', event: 'Movement to Hostels', venue: 'Campus', type: 'logistics', icon: 'walk' },
      { time: '12:45 PM', duration: '90 min', event: 'Lunch Break', venue: 'Centenary Hall (Day Scholars) / Hostels (Hostellers)', type: 'break', icon: 'restaurant' },
      { time: '02:15 PM', duration: '15 min', event: 'Movement to Venues', venue: 'Campus', type: 'logistics', icon: 'walk' },
      { time: '02:30 PM', duration: '30 min', 
        event: branchInfo ? `Club Introduction: ${DAY3_CLUBS_SLOT1[branchInfo.group]?.club || 'Clubs'}` : 'Club Introductions', 
        venue: branchInfo ? (DAY3_CLUBS_SLOT1[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'people-circle' 
      },
      { time: '03:00 PM', duration: '30 min', 
        event: branchInfo ? `Society Session: ${DAY3_CLUBS_SLOT2[branchInfo.group]?.club || 'Societies'}` : 'Society Sessions', 
        venue: branchInfo ? (DAY3_CLUBS_SLOT2[branchInfo.group]?.venue || 'Various') : 'Various Venues', 
        type: 'club', icon: 'color-palette' 
      },
      { time: '03:30 PM', duration: '30 min', event: 'Evening Snacks', venue: 'Respective Venues', type: 'break', icon: 'cafe' },
      { time: '04:00 PM', duration: '15 min', event: 'Movement to Venues', venue: 'Campus', type: 'logistics', icon: 'walk' },
    ];

    // Handle 4:15 PM conditional events for Day 3
    if (branchInfo) {
      if (branchInfo.tech === 'T2') {
        day3.push({ time: '04:15 PM', duration: '90 min', event: 'Technical Display', venue: 'Centenary Hall', type: 'academic', icon: 'hardware-chip' });
      } else if (branchInfo.sports === 'S2') {
        day3.push({ time: '04:15 PM', duration: '90 min', event: 'Sports Activities', venue: 'Athletic Ground', type: 'fun', icon: 'football' });
      } else if (branchInfo.cultural === 'A1') {
        day3.push({ time: '04:15 PM', duration: '90 min', event: 'Drams (Cultural)', venue: 'Auditorium', type: 'fun', icon: 'musical-notes' });
      } else {
        day3.push({ time: '04:15 PM', duration: '90 min', event: 'Free Time / Dispersal', venue: 'Campus', type: 'logistics', icon: 'walk' });
      }
    } else {
      day3.push({ time: '04:15 PM', duration: '90 min', event: 'Tech / Sports / Cultural Activities', venue: 'Various Venues (Check Group)', type: 'fun', icon: 'star' });
    }

    return { day1, day2, day3 };
  }, [branch]);
}
