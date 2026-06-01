/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, UserProfile } from '../types/auth';
import {
  initializeFirebase,
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  sendResetEmail,
  getUserAuthState,
} from '../services/authService';
import {
  createUserProfileIfMissing,
  getUserProfile,
  updateUserLastActive,
} from '../services/userService';
import type { FirestoreUserProfile } from '../types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<FirestoreUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase and listen for auth changes
  useEffect(() => {
    initializeFirebase();

    const unsubscribe = getUserAuthState(async (user) => {
      setUser(user);
      if (user) {
        try {
          // Ensure Firestore profile exists
          await createUserProfileIfMissing({ uid: user.uid, email: user.email, name: user.displayName || undefined });
          // Load profile
          const p = await getUserProfile(user.uid);
          setProfile(p);
          // Update last active
          await updateUserLastActive(user.uid);
        } catch (err) {
          console.warn('Error loading/creating user profile', err);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      const authUser = await signUpWithEmail(email, password, displayName);
      // Create Firestore profile
      await createUserProfileIfMissing({ uid: authUser.uid, email: authUser.email, name: displayName });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const authUser = await signInWithEmail(email, password);
      // Update last active and ensure profile exists
      await createUserProfileIfMissing({ uid: authUser.uid, email: authUser.email, name: authUser.displayName || undefined });
      await updateUserLastActive(authUser.uid);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to log in';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const authUser = await signInWithGoogle();
      await createUserProfileIfMissing({ uid: authUser.uid, email: authUser.email, name: authUser.displayName || undefined });
      await updateUserLastActive(authUser.uid);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await logOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to log out';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await sendResetEmail(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to send password reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
