import { create } from 'zustand';

interface NotificationModalState {
  isOpen: boolean;
  isDeniedForever: boolean;
  onSuccessCallback?: () => void;
  openModal: (options?: { isDeniedForever?: boolean; onSuccess?: () => void }) => void;
  closeModal: () => void;
  setDeniedForever: (denied: boolean) => void;
}

export const useNotificationModalStore = create<NotificationModalState>((set) => ({
  isOpen: false,
  isDeniedForever: false,
  onSuccessCallback: undefined,
  openModal: (options) => set({
    isOpen: true,
    isDeniedForever: options?.isDeniedForever ?? false,
    onSuccessCallback: options?.onSuccess,
  }),
  closeModal: () => set({ isOpen: false }),
  setDeniedForever: (denied) => set({ isDeniedForever: denied }),
}));
