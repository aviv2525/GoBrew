// /firebase-messaging-sw.js (Compat כדי לעבוד ב-SW)


/*

self.importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "XXX", authDomain: "XXX", projectId: "XXX", messagingSenderId: "XXX", appId: "XXX"
});

const messaging = firebase.messaging();

// מציג התראה כשמגיעה הודעה ברקע
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Notification', {
    body: body || '',
    data: payload.data || {},
  });
});





*/
