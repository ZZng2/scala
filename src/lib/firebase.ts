import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';

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

        // 1. 알림 권한 확인 및 요청
        const permission = await Notification.requestPermission();
        console.log('[FCM] Notification permission status:', permission);

        if (permission !== 'granted') {
            console.warn('[FCM] Notification permission not granted');
            return null;
        }

        // 2. 파이어베이스 앱 초기화
        const app = getFirebaseApp();
        if (!app) {
            console.error('[FCM] Firebase app initialization failed');
            return null;
        }
        console.log('[FCM] Firebase app initialized');

        // 3. 메시징 객체 획득
        const messaging = getMessaging(app);
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        // 4. Firebase 전용 서비스 워커 명시적 등록 (next-pwa와 충돌 방지)
        let swRegistration: ServiceWorkerRegistration | undefined;
        if ('serviceWorker' in navigator) {
            try {
                console.log('[FCM] Registering firebase-messaging-sw.js...');
                swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                    scope: '/firebase-cloud-messaging-push-scope'
                });
                console.log('[FCM] Firebase SW registered:', swRegistration.scope);

                // 서비스 워커가 활성화될 때까지 대기
                if (swRegistration.installing) {
                    await new Promise<void>((resolve) => {
                        swRegistration!.installing!.addEventListener('statechange', (e) => {
                            if ((e.target as ServiceWorker).state === 'activated') {
                                resolve();
                            }
                        });
                    });
                }
            } catch (swError) {
                console.warn('[FCM] Failed to register Firebase SW:', swError);
            }
        }

        // 5. 토큰 요청
        console.log('[FCM] Requesting token with VAPID key...');
        const tokenOptions: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
            vapidKey: vapidKey,
        };
        if (swRegistration) {
            tokenOptions.serviceWorkerRegistration = swRegistration;
        }

        const token = await getToken(messaging, tokenOptions);

        if (token) {
            console.log('[FCM] Token acquired successfully:', token.substring(0, 20) + '...');
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

let analytics: Analytics | null = null;

/**
 * Firebase Analytics 초기화 및 인스턴스 획득
 */
export async function getFirebaseAnalytics() {
    if (typeof window === 'undefined') return null;

    if (analytics) return analytics;

    const supported = await isSupported();
    if (!supported) return null;

    const app = getFirebaseApp();
    if (!app) return null;

    analytics = getAnalytics(app);
    return analytics;
}

/**
 * Analytics 이벤트 기록 헬퍼
 */
export async function logAnalyticsEvent(eventName: string, params?: object) {
    try {
        const analytics = await getFirebaseAnalytics();
        if (analytics) {
            logEvent(analytics, eventName, params);
            console.log(`[Analytics] Event logged: ${eventName}`, params);
        }
    } catch (error) {
        console.error('[Analytics] Error logging event:', error);
    }
}
