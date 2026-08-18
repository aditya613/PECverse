import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/utils/api';

export interface Fresher {
  id: number;
  name: string;
  branch: string;
  device_id: string;
  created_at: string;
}

interface FresherState {
  fresher: Fresher | null;
  deviceId: string | null;
  fresherToken: string | null;
  isRegistered: boolean;
  isLoading: boolean;
  initSession: () => Promise<void>;
  register: (name: string, branch: string) => Promise<void>;
  logout: () => Promise<void>;
}

const generateDeviceId = () => {
  return 'device_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

export const useFresherStore = create<FresherState>((set, get) => ({
  fresher: null,
  deviceId: null,
  fresherToken: null,
  isRegistered: false,
  isLoading: true,

  initSession: async () => {
    try {
      let storedDeviceId = await AsyncStorage.getItem('fresher_device_id');
      
      let storedToken = await SecureStore.getItemAsync('fresher_token');

      if (!storedDeviceId) {
        storedDeviceId = generateDeviceId();
        await AsyncStorage.setItem('fresher_device_id', storedDeviceId);
      }

      set({ deviceId: storedDeviceId, fresherToken: storedToken });

      // Check if already registered on backend
      try {
        const res = await api.get(`/freshers/profile/${storedDeviceId}`);
        if (res.data && res.data.fresher) {
          const fetchedToken = res.data.fresher.secret_token;
          
          if (fetchedToken && fetchedToken !== storedToken) {
            await SecureStore.setItemAsync('fresher_token', fetchedToken);
            set({ fresherToken: fetchedToken });
          }

          set({ fresher: res.data.fresher, isRegistered: true });
        }
      } catch (err: any) {
        // Not registered (404), which is totally fine.
        console.log("Fresher not registered yet.");
      }

    } catch (err) {
      console.error("Failed to init fresher session", err);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: string, branch: string) => {
    const { deviceId } = get();
    if (!deviceId) throw new Error("No device ID found");

    const res = await api.post('/freshers/register', {
      name,
      branch,
      device_id: deviceId
    });

    set({ fresher: res.data.fresher, isRegistered: true, fresherToken: res.data.fresher.secret_token });
    if (res.data.fresher.secret_token) {
      await SecureStore.setItemAsync('fresher_token', res.data.fresher.secret_token);
    }
  },

  logout: async () => {
    // Generate new device ID and clear registration
    const newDeviceId = generateDeviceId();
    await AsyncStorage.setItem('fresher_device_id', newDeviceId);
    await SecureStore.deleteItemAsync('fresher_token');
    set({ fresher: null, isRegistered: false, deviceId: newDeviceId, fresherToken: null });
  }
}));
