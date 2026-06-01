import {
  getApps,
  initializeApp as firebaseInitializeApp,
} from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';
import type { UserProfile } from '../types/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Initialize Firebase
export function initializeFirebase() {
  // Check if Firebase is already initialized
  const existingApp = getApps().find((a) => a.name === '[DEFAULT]');

  if (existingApp) {
    app = existingApp;
  } else {
    app = firebaseInitializeApp(firebaseConfig);
  }

  auth = getAuth(app);

  // Enable persistence
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting persistence:', error);
  });

  return { app, auth };
}

// Get auth instance (call initializeFirebase first)
export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return auth;
}

// Helper to ensure auth is initialized
function ensureAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return auth;
}

// Authentication functions
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> {
  const authInstance = ensureAuth();
  const userCredential = await createUserWithEmailAndPassword(
    authInstance,
    email,
    password
  );

  // Update user profile with display name
  await updateProfile(userCredential.user, {
    displayName,
  });

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    createdAt: new Date(),
  };
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserProfile> {
  const authInstance = ensureAuth();
  const userCredential = await signInWithEmailAndPassword(
    authInstance,
    email,
    password
  );

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    createdAt: new Date(),
  };
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const authInstance = ensureAuth();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(authInstance, provider);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    createdAt: new Date(),
  };
}

export async function logOut(): Promise<void> {
  const authInstance = ensureAuth();
  await signOut(authInstance);
}

export async function sendResetEmail(email: string): Promise<void> {
  const authInstance = ensureAuth();
  await sendPasswordResetEmail(authInstance, email);
}

export function getUserAuthState(
  callback: (user: UserProfile | null) => void
): () => void {
  const authInstance = ensureAuth();
  return authInstance.onAuthStateChanged((user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata?.creationTime
          ? new Date(user.metadata.creationTime)
          : new Date(),
      });
    } else {
      callback(null);
    }
  });
}
