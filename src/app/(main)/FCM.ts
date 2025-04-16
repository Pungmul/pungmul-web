'use client'

import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

 // Start Generation Here
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function FCMClient() {

    const fetchFCMToken = async (fcmToken: string) => {
        try {
            const response = await fetch('token', {
                method: 'POST',
                body: JSON.stringify({ fcmToken }),
                credentials:'include'
            })

            if (!response.ok) throw Error('비정상 동작')

            console.log(response.json)
            return true;
        } catch (e) {
            console.error(e);
        }
        return false;
    }

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            const firebaseApp = initializeApp(firebaseConfig);
            const messaging = getMessaging(firebaseApp);

            // 서비스 워커 등록
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("서비스 워커 등록 완료:", registration);
                    // FCM 토큰 요청
                    getToken(messaging, {
                        vapidKey: 'BPT_AtdFFHu1mKtFhL-8kkQ2juF8qKcTnbZNCRMZw_J4WznExZeDfW8MqR1uXOd4zgMjzOwtYQZ9wkCZKzqlE5E',
                        serviceWorkerRegistration: registration,
                    })
                        .then(async (currentToken) => {
                            if (currentToken) {
                                // await fetchFCMToken(currentToken);
                                console.log("FCM 등록 토큰:", currentToken);
                            } else {
                                console.error("토큰을 가져오지 못했습니다.");
                            }
                        })
                        .catch((err) => {
                            console.error("토큰 가져오기 오류:", err);
                        });
                })
                .catch((err) => console.error("서비스 워커 등록 오류:", err));

            // 메시지 수신 처리
            onMessage(messaging, (payload) => {
                console.log('메시지 수신:', payload);
                if (payload.notification?.title && payload.notification?.body) {
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        // icon: '/icon.png',  // 원하는 아이콘 경로
                    });
                } else {
                    console.warn('잘못된 메시지 형식:', payload);
                }
            });
        }
    }, []);

    return null; // 이 컴포넌트는 UI에 렌더링하지 않음
}
