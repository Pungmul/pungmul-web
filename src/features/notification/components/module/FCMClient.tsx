"use client";
import { useFCMForeground, useSyncNotificationPermission } from "../../hooks";

export default function FCMClient() {
  useFCMForeground();
  useSyncNotificationPermission();
  
  return null;
}
