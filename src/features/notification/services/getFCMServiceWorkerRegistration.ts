export const FCM_SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";

/**
 * scriptURL이 FCM 전용 SW인지 확인
 */
function isFCMRegistration(reg: ServiceWorkerRegistration): boolean {
  const sw = reg.active ?? reg.waiting ?? reg.installing;
  if (!sw) return false;
  try {
    const pathname = new URL(sw.scriptURL).pathname;
    return pathname === FCM_SERVICE_WORKER_PATH;
  } catch {
    return false;
  }
}

/**
 * 이미 등록된 Service Worker 중 FCM용(firebase-messaging-sw.js) 등록을 반환.
 * 없으면 null.
 */
export async function getFCMServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof navigator === "undefined" ||
    !navigator.serviceWorker?.getRegistrations
  ) {
    return null;
  }
  const registrations = await navigator.serviceWorker.getRegistrations();
  return registrations.find(isFCMRegistration) ?? null;
}
