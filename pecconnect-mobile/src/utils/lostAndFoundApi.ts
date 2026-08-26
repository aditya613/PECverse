import { api } from './api';

export type LostAndFoundItem = {
  id: number;
  user_id: number;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string | null;
  image_url: string | null;
  status: 'active' | 'resolved';
  date_lost_or_found: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    branch: string;
    profile_photo: string | null;
  };
  comments_count: number;
  reports_count: number;
};

export type LostAndFoundComment = {
  id: number;
  item_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    branch: string;
    profile_photo: string | null;
  };
};

export const fetchLostAndFoundItems = async (type?: 'lost' | 'found', status: 'active' | 'resolved' = 'active') => {
  const res = await api.get('/lost-and-found', { params: { type, status } });
  return res.data;
};

export const createLostAndFoundItem = async (formData: FormData) => {
  const res = await api.post('/lost-and-found', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const resolveLostAndFoundItem = async (id: number) => {
  const res = await api.put(`/lost-and-found/${id}/resolve`);
  return res.data;
};

export const deleteLostAndFoundItem = async (id: number) => {
  const res = await api.delete(`/lost-and-found/${id}`);
  return res.data;
};

export const fetchLostAndFoundComments = async (id: number) => {
  const res = await api.get(`/lost-and-found/${id}/comments`);
  return res.data.comments as LostAndFoundComment[];
};

export const createLostAndFoundComment = async (id: number, content: string) => {
  const res = await api.post(`/lost-and-found/${id}/comments`, { content });
  return res.data.comment as LostAndFoundComment;
};

export const deleteLostAndFoundComment = async (id: number) => {
  const res = await api.delete(`/lost-and-found/comments/${id}`);
  return res.data;
};

export const reportLostAndFoundItem = async (id: number, reason: string) => {
  const res = await api.post(`/lost-and-found/${id}/report`, { reason });
  return res.data;
};
