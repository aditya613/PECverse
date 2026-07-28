import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface MessStore {
  selectedMessId: number | null;
  setSelectedMessId: (id: number) => Promise<void>;
  loadMessId: () => Promise<void>;
}

export const useMessStore = create<MessStore>((set) => ({
  selectedMessId: null,
  
  setSelectedMessId: async (id: number) => {
    await SecureStore.setItemAsync('pecconnect_mess_id', id.toString());
    set({ selectedMessId: id });
  },

  loadMessId: async () => {
    const idStr = await SecureStore.getItemAsync('pecconnect_mess_id');
    if (idStr) {
      set({ selectedMessId: parseInt(idStr, 10) });
    }
  },
}));
