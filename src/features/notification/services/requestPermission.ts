import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebaseClient";
import {
  getFCMServiceWorkerRegistration,
  FCM_SERVICE_WORKER_PATH,
} from "./getFCMServiceWorkerRegistration";
import { notificationPermissionStore } from "../store";
import { supportsPushNotification } from "../lib/guards";

export async function requestFCMToken(): Promise<string | null> {
  if (!supportsPushNotification()) return null;

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

  // FCM용 SW 등록만 사용 (다른 SW와 구분). 없으면 등록
  await navigator.serviceWorker.ready;
  let registration = await getFCMServiceWorkerRegistration();
  if (!registration) {
    registration = await navigator.serviceWorker.register(
      FCM_SERVICE_WORKER_PATH
    );
  }

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    serviceWorkerRegistration: registration,
  });

  // FCM 토큰 반환
  return token ?? null;
}
