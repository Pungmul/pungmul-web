// notificationPermissionStore.ts
import { create } from "zustand";

export type PermissionStatus = NotificationPermission;

type PermissionState = {
  permission: PermissionStatus;
  setPermission: (p: PermissionStatus) => void;
};

export const notificationPermissionStore = create<PermissionState>((set) => ({
  permission: "default",
  setPermission: (permission) => set({ permission }),
}));
