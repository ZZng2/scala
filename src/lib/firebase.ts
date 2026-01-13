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
export async function requestFCMToken(): Promise<string> {
    if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다');
    }



    // 1. 알림 권한 확인 및 요청
    let permission: NotificationPermission;
    try {
        permission = await Notification.requestPermission();

    } catch (permError: any) {
        console.error('[FCM] Permission request error:', permError);
        throw new Error(`권한 요청 실패: ${permError?.message || '알 수 없는 오류'}`);
    }

    if (permission === 'denied') {
        throw new Error('알림 권한이 거부되었습니다. 설정에서 허용해주세요.');
    }
    if (permission !== 'granted') {
        throw new Error('알림 권한이 허용되지 않았습니다');
    }

    // 2. 파이어베이스 앱 초기화
    let app;
    try {
        app = getFirebaseApp();
        if (!app) {
            throw new Error('Firebase 앱 초기화 실패 (null)');
        }

    } catch (appError: any) {
        console.error('[FCM] Firebase app initialization error:', appError);
        throw new Error(`Firebase 초기화 실패: ${appError?.message || '알 수 없는 오류'}`);
    }

    // 3. 메시징 객체 획득
    let messaging;
    try {
        messaging = getMessaging(app);

    } catch (msgError: any) {
        console.error('[FCM] Messaging initialization error:', msgError);
        throw new Error(`메시징 초기화 실패: ${msgError?.message || '알 수 없는 오류'}`);
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
        throw new Error('VAPID 키가 설정되지 않았습니다');
    }

    // 4. Firebase 전용 서비스 워커 명시적 등록
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
        try {

            swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/'
            });


            // 서비스 워커가 활성화될 때까지 대기 (최대 10초)
            if (!swRegistration.active) {

                await new Promise<void>((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('서비스 워커 활성화 시간 초과'));
                    }, 10000);

                    const sw = swRegistration!.installing || swRegistration!.waiting;
                    if (sw) {
                        sw.addEventListener('statechange', () => {
                            if (sw.state === 'activated') {
                                clearTimeout(timeout);
                                resolve();
                            }
                        });
                    } else {
                        clearTimeout(timeout);
                        resolve();
                    }
                });

            }
        } catch (swError: any) {
            console.error('[FCM] SW registration error:', swError);
            throw new Error(`서비스 워커 등록 실패: ${swError?.message || '알 수 없는 오류'}`);
        }
    } else {
        throw new Error('이 브라우저는 서비스 워커를 지원하지 않습니다');
    }

    // 5. 토큰 요청
    try {

        const tokenOptions: { vapidKey: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
            vapidKey: vapidKey,
        };
        if (swRegistration) {
            tokenOptions.serviceWorkerRegistration = swRegistration;
        }



        const token = await getToken(messaging, tokenOptions);

        if (token) {

            return token;
        } else {
            throw new Error('토큰 발급 실패 (빈 토큰 반환)');
        }
    } catch (tokenError: any) {
        console.error('[FCM] Token request error:', tokenError);
        console.error('[FCM] Error name:', tokenError?.name);
        console.error('[FCM] Error message:', tokenError?.message);
        console.error('[FCM] Error code:', tokenError?.code);
        throw new Error(`토큰 요청 실패: ${tokenError?.message || tokenError?.code || '알 수 없는 오류'}`);
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

        }
    } catch (error) {
        console.error('[Analytics] Error logging event:', error);
    }
}
