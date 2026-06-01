import { getApps, initializeApp as firebaseInitializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';

let db: ReturnType<typeof getFirestore> | null = null;

export function initializeFirestore() {
  if (db) return db;
  const existing = getApps().find((a) => a.name === '[DEFAULT]');
  if (!existing) {
    try {
      firebaseInitializeApp(firebaseConfig);
    } catch (err) {
      console.warn('Failed to initialize Firebase app:', err);
      throw err;
    }
  }
  try {
    db = getFirestore();
    return db;
  } catch (err) {
    console.warn('Failed to initialize Firestore:', err);
    throw err;
  }
}

export function getFirestoreSafe() {
  if (!db) {
    try {
      return initializeFirestore();
    } catch {
      return null;
    }
  }
  return db;
}
