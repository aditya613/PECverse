import { api } from './api';

export const getFullImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'https://pecapp.theaspirants.co.in';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export interface ClassMember {
  id: number;
  name: string;
  roll_no: string | null;
  profile_photo: string | null;
  role: string;
  is_cr: boolean;
  joined_at: string | null;
}

export interface ClassRosterClassInfo {
  id: number;
  group_name: string;
  year: number;
  branch: string;
  branch_code: string | null;
  cr: {
    id: number;
    name: string;
    roll_no: string | null;
  } | null;
}

export interface ClassRosterStats {
  total_enrolled: number;
  matching_count: number;
  is_viewer_cr: boolean;
}

export interface ClassRosterResponse {
  class: ClassRosterClassInfo;
  stats: ClassRosterStats;
  members: ClassMember[];
}

export const fetchClassMembers = async (params?: {
  search?: string;
  sort?: 'roll_no' | 'name' | 'latest';
}): Promise<ClassRosterResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sort) queryParams.append('sort', params.sort);

  const res = await api.get<ClassRosterResponse>(`/class/members?${queryParams.toString()}`);
  return res.data;
};
