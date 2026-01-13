importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');
importScripts('/firebase-config.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // data-only 메시지에서 title/body 읽기
    const notificationTitle = payload.data?.title || '새 알림';
    const notificationOptions = {
        body: payload.data?.body || '',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
            url: payload.data?.url || '/home',
        },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
