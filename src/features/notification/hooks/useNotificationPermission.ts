"use client";

import { notificationPermissionStore } from "../store";

export function useNotificationPermission() {
  const permission = notificationPermissionStore(
    (state) => state.permission
  );

  return permission;
}
