import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 클라이언트 사이드에서만 초기화
export function getFirebaseApp() {
    if (typeof window === 'undefined') return null;
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

/**
 * FCM 토큰 발급
 * @returns FCM 토큰 또는 null (권한 거부 시)
 */
export async function requestFCMToken(): Promise<string | null> {
    try {
        if (typeof window === 'undefined') return null;

        console.log('[FCM] Starting token request process...');

        // 1. 알림 권한 확인 및 요청을 가장 먼저 수행 (파이어베이스와 무관하게 팝업 유도)
        const permission = await Notification.requestPermission();
        console.log('[FCM] Notification permission status:', permission);

        if (permission !== 'granted') {
            console.warn('[FCM] Notification permission not granted');
            return null;
        }

        // 2. 파이어베이스 앱 초기화 검사
        const app = getFirebaseApp();
        if (!app) {
            console.error('[FCM] Firebase app initialization failed');
            return null;
        }
        console.log('[FCM] Firebase app initialized');

        // 3. 메시징 객체 획득
        const messaging = getMessaging(app);
        console.log('[FCM] Messaging instance obtained');

        // 4. VAPID 키 확인
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error('[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing');
            // 키가 없어도 시도는 하지만 에러 가능성 높음
        }

        // 5. 토큰 요청
        console.log('[FCM] Requesting token with VAPID key...');
        const token = await getToken(messaging, {
            vapidKey: vapidKey,
        });

        if (token) {
            console.log('[FCM] Token acquired successfully');
            return token;
        } else {
            console.error('[FCM] Token request returned empty');
            return null;
        }
    } catch (error) {
        console.error('[FCM] Unexpected error during token request:', error);
        return null;
    }
}

/**
 * Foreground 메시지 수신 리스너
 */
export function onForegroundMessage(callback: (payload: any) => void) {
    if (typeof window === 'undefined') return;

    const app = getFirebaseApp();
    if (!app) return;

    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
        console.log('Foreground message:', payload);
        callback(payload);
    });
}
