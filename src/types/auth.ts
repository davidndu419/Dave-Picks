import type { FirestoreUserProfile } from './user';

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
};

export type AuthContextType = {
  // Authentication user (from Firebase Auth)
  user: UserProfile | null;
  // Firestore profile (extended user settings)
  profile: FirestoreUserProfile | null;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};
