import type { Timestamp } from 'firebase/firestore';

export type SlipStatus = 'building' | 'saved' | 'played' | 'won' | 'lost' | 'void';

export type SlipSelection = {
  matchId: string;
  matchTime: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  odds: number;
};

export type SlipDocument = {
  id: string;
  date: string;
  selections: SlipSelection[];
  combinedOdds: number;
  combinedProbability: number;
  stake: number;
  currency: string;
  potentialReturn: number;
  status: SlipStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type SlipPayload = Omit<SlipDocument, 'id' | 'createdAt' | 'updatedAt'>;
