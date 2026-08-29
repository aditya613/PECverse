import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: number;
  name: string;
  email: string;
  roll_no: string | null;
  role: 'student' | 'cr' | 'superadmin';
  class_id: number | null;
  profile_photo: string | null;
  expo_push_token?: string | null;
  courseClass?: {
    group_name: string;
    branch: {
      name: string;
      code: string;
    };
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true by default while checking token on app launch

  login: async (token, user) => {
    await SecureStore.setItemAsync('auth_token', token);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => set({ user }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
