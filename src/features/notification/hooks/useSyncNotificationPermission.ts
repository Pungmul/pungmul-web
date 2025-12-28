"use client";

import { useEffect } from "react";
import { notificationPermissionStore } from "../store";

export function useSyncNotificationPermission() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const browserPermission = Notification.permission;
    console.log("browserPermission", browserPermission);
    notificationPermissionStore
      .getState()
      .setPermission(browserPermission);
  }, []);
}
