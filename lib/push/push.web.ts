// lib/push.ts  — Web only
import { app, db } from "@/lib/firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";

/**
 * רישום FCM ל-Web בלבד. לא משתמש בשום expo-notifications.
 * לעולם לא יקריס את האפליקציה — מחזיר null במקרה שאין תמיכה/הרשאה.
 */
let swRegPromise: Promise<ServiceWorkerRegistration> | null = null;
let cachedToken: string | null = null;
let inFlight: Promise<string | null> | null = null;

function isSecureOrigin() {
  return typeof window !== "undefined" &&
    (location.protocol === "https:" || location.hostname === "localhost");
}

export async function registerFCMWeb(userId: string, vapidKey?: string) {
  try {
    // הרצה אחת בזמן חיי הטאב
    if (inFlight) return inFlight;

    inFlight = (async () => {
      // טוענים את SDK של messaging דינמית כדי שלא ייכנס לבאנדל בפלטפורמות אחרות
      const { isSupported, getMessaging, getToken, onMessage } = await import("firebase/messaging");

      const supported = await isSupported().catch(() => false);
      if (!supported || !isSecureOrigin() || !vapidKey) return null;

      // רישום ה-Service Worker בשורש האתר (public/firebase-messaging-sw.js)
      if (!swRegPromise && "serviceWorker" in navigator) {
        swRegPromise = navigator.serviceWorker.register("/firebase-messaging-sw.js") as any;
      }
      const reg = swRegPromise ? await swRegPromise : undefined;

      const messaging = getMessaging(app);

      // קבלת token (עם מטמון כדי למנוע קריאות כפולות בניווט)
      const token = cachedToken ?? await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: reg,
      });
      if (!token) return null;
      cachedToken = token;

      // שמירה ב-users/{uid}.fcmTokens
      try {
        await setDoc(doc(db, "users", userId), { fcmTokens: arrayUnion(token) }, { merge: true });
      } catch (_) {}

      // הודעות כשהטאב בפורגרראונד (לא חובה)
      try {
        onMessage(messaging, (p) => console.log("Web foreground push:", p));
      } catch (_) {}

      return token;
    })();

    return await inFlight;
  } catch (_) {
    return null;
  } finally {
    inFlight = null;
  }
}
