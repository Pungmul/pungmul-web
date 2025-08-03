import { NotificationData } from "@/shared/types/notification/notification";
import { create } from "zustand";

interface NotificationState {
  notifications: NotificationData[];
  addNotification: (n: NotificationData) => void;
  clearNotifications: () => void;
}

export const notificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({ notifications: [n, ...state.notifications] })),
  clearNotifications: () => set({ notifications: [] }),
})); 