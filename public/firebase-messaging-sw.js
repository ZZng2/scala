importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');
importScripts('/firebase-config.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Firebase onBackgroundMessage (기존 방식)
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

// 표준 Push Event 핸들러 추가 (iOS PWA 백그라운드 개선)
self.addEventListener('push', function (event) {
    console.log('[SW] Push event received:', event);

    // Firebase가 이미 처리했으면 중복 방지
    if (event.data) {
        try {
            const payload = event.data.json();

            // Firebase 메시지 형식 확인
            if (payload.from || payload.notification || payload.data) {
                console.log('[SW] Firebase message detected, skipping duplicate handling');
                return; // Firebase가 처리하도록 함
            }
        } catch (e) {
            // JSON 파싱 실패 시 계속 진행
        }
    }

    let notificationData = {
        title: '새 알림',
        body: '',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'scala-notification',
        requireInteraction: false,
        data: {
            url: '/home'
        }
    };

    // 푸시 데이터 파싱
    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData.title = payload.title || payload.data?.title || '새 알림';
            notificationData.body = payload.body || payload.data?.body || '';
            notificationData.data.url = payload.url || payload.data?.url || '/home';
        } catch (e) {
            console.error('[SW] Failed to parse push data:', e);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: notificationData.tag,
            requireInteraction: notificationData.requireInteraction,
            data: notificationData.data
        })
    );
});

// 개선된 notificationclick 이벤트 (이미 열린 창 포커스)
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/home';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // 이미 열려있는 Scala 창이 있으면 포커스
                for (let client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        console.log('[SW] Focusing existing window:', client.url);
                        return client.focus().then(() => {
                            // 포커스 후 URL 이동 (가능한 경우)
                            if ('navigate' in client) {
                                return client.navigate(urlToOpen);
                            }
                        });
                    }
                }
                // 열려있는 창이 없으면 새 창 열기
                if (clients.openWindow) {
                    console.log('[SW] Opening new window:', urlToOpen);
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
