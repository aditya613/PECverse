import { api } from './api';

export type MarketplaceCategory = 
  | 'all'
  | 'cycles' 
  | 'academics' 
  | 'hostel' 
  | 'electronics' 
  | 'fashion' 
  | 'others';

export type MarketplaceCondition = 'like_new' | 'good' | 'fair';
export type MarketplaceStatus = 'available' | 'sold';

export interface MarketplaceItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: MarketplaceCondition;
  location: string | null;
  contact_whatsapp: string | null;
  contact_phone: string | null;
  image_url: string | null;
  status: MarketplaceStatus;
  created_at: string;
  reports_count?: number;
  is_owner?: boolean;
  user?: {
    id: number;
    name: string;
    branch: string;
    profile_photo: string | null;
    created_at?: string;
  };
}

export interface MarketplaceFeedResponse {
  data: MarketplaceItem[];
  current_page: number;
  last_page: number;
  total: number;
  next_page_url: string | null;
}

export interface MyListingsResponse {
  summary: {
    total: number;
    active: number;
    sold: number;
  };
  items: MarketplaceItem[];
}

export interface FetchMarketplaceParams {
  category?: string;
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  condition?: string;
  sort?: 'latest' | 'price_asc' | 'price_desc';
  page?: number;
}

export const fetchMarketplaceItems = async (params: FetchMarketplaceParams = {}): Promise<MarketplaceFeedResponse> => {
  const res = await api.get('/marketplace', { params });
  return res.data;
};

export const fetchMarketplaceItem = async (id: number | string): Promise<MarketplaceItem> => {
  const res = await api.get(`/marketplace/${id}`);
  return res.data;
};

export const createMarketplaceItem = async (formData: FormData): Promise<{ message: string; item: MarketplaceItem }> => {
  const res = await api.post('/marketplace', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateMarketplaceItemStatus = async (id: number | string, status: 'available' | 'sold') => {
  const res = await api.patch(`/marketplace/${id}/status`, { status });
  return res.data;
};

export const deleteMarketplaceItem = async (id: number | string) => {
  const res = await api.delete(`/marketplace/${id}`);
  return res.data;
};

export const fetchMyMarketplaceListings = async (): Promise<MyListingsResponse> => {
  const res = await api.get('/marketplace/my-listings');
  return res.data;
};

export const reportMarketplaceItem = async (id: number | string, reason: string) => {
  const res = await api.post(`/marketplace/${id}/report`, { reason });
  return res.data;
};
