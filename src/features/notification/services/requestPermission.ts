import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebaseClient";
import { notificationPermissionStore } from "../store";

export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    console.warn("window not found");
    return null;
  }
  if (!("serviceWorker" in navigator)) {
    console.warn("serviceWorker not found");
    return null;
  }

  // 알림 권한 요청
  const permission = await Notification.requestPermission();
  
  // 알림 권한 상태 저장
  notificationPermissionStore.getState().setPermission(permission);

  if (permission !== "granted") {
    console.log("알림 권한 거부");
    return null;
  }

  const messaging = getFirebaseMessaging();
  if (!messaging) return null;

  // FCM service worker 등록
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js"
  );

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: registration,
  });

  // FCM 토큰 반환
  return token ?? null;
}
