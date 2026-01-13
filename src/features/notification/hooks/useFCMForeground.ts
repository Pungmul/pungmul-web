"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../services";
import { notificationStore } from "../store";
import { supportsNotification } from "../lib/guards";

export function useFCMForeground() {
  const addNotification = notificationStore((s) => s.addNotification);

  useEffect(() => {
    if (!supportsNotification()) return;

    const messaging = getFirebaseMessaging();
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (!notification) return;

      addNotification({
        title: notification.title || "새 알림",
        body: notification.body || "",
        receivedAt: new Date(),
      });
    });

    return unsubscribe;
  }, [addNotification]);
}
