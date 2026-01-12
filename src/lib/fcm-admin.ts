import admin from 'firebase-admin';

// Firebase Admin 초기화 (서버사이드)
if (!admin.apps.length) {
    try {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            console.warn('[FCM-Admin] FIREBASE_SERVICE_ACCOUNT_KEY is missing');
        } else {
            const serviceAccount = JSON.parse(serviceAccountKey);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('[FCM-Admin] Firebase Admin initialized successfully');
        }
    } catch (error) {
        console.error('[FCM-Admin] Firebase Admin initialization error:', error);
    }
}

/**
 * FCM 푸시 알림 발송
 * @param tokens FCM 토큰 배열
 * @param title 알림 제목
 * @param body 알림 본문
 * @param scholarshipId 장학금 ID (선택)
 */
export async function sendPushNotification(
    tokens: string[],
    title: string,
    body: string,
    scholarshipId?: string
): Promise<{ success: number; failure: number }> {
    if (tokens.length === 0) {
        return { success: 0, failure: 0 };
    }

    // 중복 토큰 제거 및 유효하지 않은 토큰 필터링
    const uniqueTokens = Array.from(new Set(tokens)).filter(Boolean);

    const message: admin.messaging.MulticastMessage = {
        tokens: uniqueTokens,
        notification: {
            title,
            body,
        },
        data: {
            scholarshipId: scholarshipId || '',
            url: scholarshipId ? `/scholarship/${scholarshipId}` : '/home',
        },
        webpush: {
            fcmOptions: {
                link: scholarshipId ? `/scholarship/${scholarshipId}` : '/home',
            },
            notification: {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
            }
        },
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        return {
            success: response.successCount,
            failure: response.failureCount,
        };
    } catch (error) {
        console.error('FCM send error:', error);
        return { success: 0, failure: uniqueTokens.length };
    }
}
