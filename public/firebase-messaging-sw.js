importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCWrmunf0CUwdDUaZo0jANyONfB0LpwYd8",
  authDomain: "pungmulsomething.firebaseapp.com",
  projectId: "pungmulsomething",
  storageBucket: "pungmulsomething.appspot.com",
  messagingSenderId: "709126523193",
  appId: "1:709126523193:web:3a681b6f5b2ff4627880e8",
  measurementId: "G-DXH7WC3BSK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("백그라운드 메시지 수신: ", payload);

  const { title, body } = payload.notification || {};
  if (!title || !body) return;

  self.registration.showNotification(title, {
    body,
  });
});
