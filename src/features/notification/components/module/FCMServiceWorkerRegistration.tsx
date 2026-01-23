"use client";

import { useRegisterFCMServiceWorker } from "../../hooks";

/**
 * FCM용 Service Worker 등록을 담당하는 컴포넌트.
 * 루트 레이아웃에 배치하여 앱 전체에서 firebase-messaging-sw가 등록되도록 합니다.
 * 렌더 결과 없음 (null 반환)
 */
export default function FCMServiceWorkerRegistration() {
  useRegisterFCMServiceWorker();
  return null;
}
