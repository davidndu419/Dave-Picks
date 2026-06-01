export type Prediction = {
  matchId: string;
  sport: 'Football' | 'Tennis' | string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string; // ISO string
  market: string;
  odds: number;
  confidence: number; // 0-100
  rank: number;
  geminiReasoning: string;
  result?: 'pending' | 'win' | 'lose' | string;
};

export type SortOption = 'confidence' | 'odds' | 'time';
