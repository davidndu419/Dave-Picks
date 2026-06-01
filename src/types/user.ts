import type { Timestamp } from 'firebase/firestore';

export interface FirestoreUserProfile {
  name: string;
  email: string;
  defaultStake: number;
  currency: string;
  notificationsEnabled: boolean;
  targetOddsMin: number;
  targetOddsMax: number;
  confidenceThreshold: number;
  createdAt: Timestamp | null;
  lastActiveAt: Timestamp | null;
}
