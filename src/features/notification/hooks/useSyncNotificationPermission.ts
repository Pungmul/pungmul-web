"use client";

import { useEffect } from "react";
import { notificationPermissionStore } from "../store";
import { supportsNotification } from "../lib/guards";

export function useSyncNotificationPermission() {
  useEffect(() => {
    if (!supportsNotification()) return;

    const browserPermission = Notification.permission;
    notificationPermissionStore.getState().setPermission(browserPermission);
  }, []);
}
