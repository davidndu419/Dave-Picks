import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getFirestoreSafe, initializeFirestore } from './firestoreService';
import type { SlipDocument, SlipPayload } from '../types/slip';

async function ensureDb() {
  const db = getFirestoreSafe() || initializeFirestore();
  return db;
}

export async function createSlip(userId: string, payload: SlipPayload): Promise<string | null> {
  try {
    const db = await ensureDb();
    const slipsRef = collection(db, 'users', userId, 'slips');
    const newSlipRef = doc(slipsRef);
    await setDoc(newSlipRef, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as unknown as Record<string, unknown>);
    return newSlipRef.id;
  } catch (err) {
    console.error('createSlip error', err);
    return null;
  }
}

export async function updateSlip(userId: string, slipId: string, payload: Partial<Omit<SlipPayload, 'date'>>): Promise<boolean> {
  try {
    const db = await ensureDb();
    const slipRef = doc(db, 'users', userId, 'slips', slipId);
    await updateDoc(slipRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    } as unknown as Record<string, unknown>);
    return true;
  } catch (err) {
    console.error('updateSlip error', err);
    return false;
  }
}

export async function getUserSlips(userId: string): Promise<SlipDocument[]> {
  try {
    const db = await ensureDb();
    const slipsRef = collection(db, 'users', userId, 'slips');
    const q = query(slipsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SlipDocument, 'id'>),
    }));
  } catch (err) {
    console.error('getUserSlips error', err);
    return [];
  }
}

export async function getSlip(userId: string, slipId: string): Promise<SlipDocument | null> {
  try {
    const db = await ensureDb();
    const slipRef = doc(db, 'users', userId, 'slips', slipId);
    const snap = await getDoc(slipRef);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...(snap.data() as Omit<SlipDocument, 'id'>),
    };
  } catch (err) {
    console.error('getSlip error', err);
    return null;
  }
}

export async function deleteSlip(userId: string, slipId: string): Promise<boolean> {
  try {
    const db = await ensureDb();
    const slipRef = doc(db, 'users', userId, 'slips', slipId);
    await deleteDoc(slipRef);
    return true;
  } catch (err) {
    console.error('deleteSlip error', err);
    return false;
  }
}
