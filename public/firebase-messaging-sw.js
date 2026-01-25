importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js",
);

const CACHE_NAME = "pungdung-v1";
const urlsToCache = ["/", "/manifest.json"];

const firebaseConfig = {
  apiKey: "AIzaSyCWrmunf0CUwdDUaZo0jANyONfB0LpwYd8",
  authDomain: "pungmulsomething.firebaseapp.com",
  projectId: "pungmulsomething",
  storageBucket: "pungmulsomething.appspot.com",
  messagingSenderId: "709126523193",
  appId: "1:709126523193:web:3a681b6f5b2ff4627880e8",
  measurementId: "G-DXH7WC3BSK",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Install event - 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
  self.skipWaiting();
});

// Activate event - 오래된 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - Network First 전략
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공한 응답을 캐시에 저장
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 반환
        return caches.match(event.request);
      }),
  );
});

// FCM 백그라운드 메시지
messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신: ", payload);

  const { title, body } = payload.notification || {};
  if (!title || !body) return;

  self.registration.showNotification(title, {
    body,
    icon: "/logos/pungdeong_logo_192.png",
    badge: "/logos/pungdeong_logo_192.png",
  });
});
