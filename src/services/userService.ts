import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreSafe, initializeFirestore } from './firestoreService';
import type { FirestoreUserProfile } from '../types/user';

async function ensureDb() {
  const db = getFirestoreSafe() || initializeFirestore();
  return db;
}

export async function getUserProfile(userId: string): Promise<FirestoreUserProfile | null> {
  try {
    const db = await ensureDb();
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as FirestoreUserProfile;
  } catch (err) {
    console.error('getUserProfile error', err);
    return null;
  }
}

export async function createUserProfileIfMissing(user: { uid: string; email: string; name?: string }) {
  try {
    const db = await ensureDb();
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      // do not overwrite existing important fields
      return snap.data() as FirestoreUserProfile;
    }

    const dataRaw = {
      name: user.name || user.email || 'Anonymous',
      email: user.email,
      defaultStake: 1000,
      currency: 'NGN',
      notificationsEnabled: true,
      targetOddsMin: 5.0,
      targetOddsMax: 6.5,
      confidenceThreshold: 60,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    };

    await setDoc(ref, dataRaw as unknown as Record<string, unknown>);
    const createdSnap = await getDoc(ref);
    return createdSnap.exists() ? (createdSnap.data() as FirestoreUserProfile) : null;
  } catch (err) {
    console.error('createUserProfileIfMissing error', err);
    return null;
  }
}

export async function updateUserLastActive(userId: string) {
  try {
    const db = await ensureDb();
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { lastActiveAt: serverTimestamp() });
  } catch (err) {
    console.error('updateUserLastActive error', err);
  }
}

export async function updateUserProfile(userId: string, data: Partial<FirestoreUserProfile>) {
  try {
    const db = await ensureDb();
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, data as unknown as Record<string, unknown>);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as FirestoreUserProfile) : null;
  } catch (err) {
    console.error('updateUserProfile error', err);
    return null;
  }
}
