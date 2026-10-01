import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Enforce browser local persistence for user sessions
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Failed to configure browser local persistence:', err);
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export default app;
