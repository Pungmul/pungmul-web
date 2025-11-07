"use client";

import { useEffect } from "react";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { notificationStore } from "@/features/notification/store";

// Firebase 설정 - 클라이언트 노출이 안전함
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Firebase 앱 초기화 (한 번만 실행되도록)
let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
  }
  return { firebaseApp, messaging };
};

export default function FCMClient() {
  const addNotification = notificationStore((s) => s.addNotification);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("알림 권한이 거부되었습니다.");
          return false;
        }
        return true;
      } catch (error) {
        console.error("알림 권한 요청 실패:", error);
        return false;
      }
    };

    const setupFCM = async () => {
      // 알림 권한 요청
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      // 브라우저 환경 확인
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
        console.log("서비스 워커를 지원하지 않는 환경입니다.");
        return;
      }

      const deviceInfo = window.navigator.userAgent.split(" ")[1];
      console.log("디바이스 정보:", deviceInfo);

      // Firebase 초기화
      const { messaging } = initializeFirebase();
      
      if (!messaging) {
        console.error("Firebase messaging 초기화 실패");
        return;
      }

      // FCM 토큰 요청 함수
      const fetchFCMToken = async (fcmToken: string) => {
        try {
          const response = await fetch("/api/fcm-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fcmToken, deviceInfo }),
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log("FCM 토큰 등록 성공:", result);
          return true;
        } catch (error) {
          console.error("FCM 토큰 등록 실패:", error);
          return false;
        }
      };

      // 서비스 워커 등록 및 FCM 토큰 요청
      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("서비스 워커 등록 완료:", registration);

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "",
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM 토큰:", currentToken);
          await fetchFCMToken(currentToken);
        } else {
          console.log("FCM 토큰을 가져올 수 없습니다.");
        }

        // 토큰 갱신은 필요시 수동으로 처리
        // messaging.onTokenRefresh는 지원되지 않으므로 제거

        // 포그라운드 메시지 처리
        onMessage(messaging, (payload) => {
          console.log("포그라운드 메시지 수신:", payload);
          
          const notification = payload.notification;
          if (notification) {
            addNotification({
              title: notification.title || "새 알림",
              body: notification.body || "",
              receivedAt: new Date(),
            });
          }
        });

      } catch (error) {
        console.error("FCM 설정 실패:", error);
      }
    };

    setupFCM();
  }, [addNotification]);

  return null;
} 