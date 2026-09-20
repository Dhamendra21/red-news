import { initializeApp } from 'firebase/app';
// messaging dynamically imported on client
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            "AIzaSyA2C9i_mqZacHoRFVnyJSO5RcKZ53goRPw",
  authDomain:        "colors-weekly.firebaseapp.com",
  projectId:         "colors-weekly",
  storageBucket:     "colors-weekly.firebasestorage.app",
  messagingSenderId: "816110710433",
  appId:             "1:816110710433:web:68d012d608f8a5531e4ae0",
  measurementId:     "G-QB5MFH4NHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

// Messaging dynamically initialized later

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === 'undefined') return null;
    if (!('Notification' in window)) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    const { getMessaging, getToken } = await import('firebase/messaging');
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });

    if (token) {
      console.log('FCM Token:', token);
      return token;
    }
    return null;
  } catch (err) {
    console.error('FCM token error:', err);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = async () => {
  if (typeof window === 'undefined') return Promise.reject('SSR');
  const { getMessaging, onMessage } = await import('firebase/messaging');
  const messaging = getMessaging(app);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => resolve(payload));
  });
};

// No messaging export needed
export default app;