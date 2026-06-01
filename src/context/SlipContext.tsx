/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import type { Prediction } from '../types/prediction';
import type { SlipSelection } from '../types/slip';

type SlipItem = SlipSelection;

type SlipContextType = {
  items: SlipItem[];
  slipId?: string;
  stake: number;
  setStake: (value: number) => void;
  add: (p: Prediction) => boolean;
  remove: (matchId: string) => void;
  has: (matchId: string) => boolean;
  count: number;
  combinedOdds: number;
  combinedProbability: number;
  potentialReturn: number;
  clear: () => void;
  setSlipId: (id: string | undefined) => void;
  toast: string | null;
  notify: (message: string) => void;
};

const SlipContext = createContext<SlipContextType | undefined>(undefined);

export function SlipProvider({ children, initialStake }: { children: ReactNode; initialStake?: number }) {
  const [items, setItems] = useState<SlipItem[]>([]);
  const [slipId, setSlipId] = useState<string | undefined>(undefined);
  const [stake, setStake] = useState(initialStake ?? 1000);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (message: string) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const add = (p: Prediction) => {
    if (items.find((i) => i.matchId === p.matchId)) return false;
    const selection: SlipSelection = {
      matchId: p.matchId,
      matchTime: p.matchTime,
      league: p.league,
      homeTeam: p.homeTeam,
      awayTeam: p.awayTeam,
      market: p.market,
      odds: p.odds,
    };
    setItems((s) => [...s, selection]);
    return true;
  };

  const remove = (matchId: string) => {
    setItems((s) => s.filter((item) => item.matchId !== matchId));
  };

  const has = (matchId: string) => items.some((i) => i.matchId === matchId);

  const clear = () => {
    setItems([]);
    setSlipId(undefined);
  };

  const combinedOdds = useMemo(() => {
    if (items.length === 0) return 0;
    return items.reduce((acc, item) => acc * item.odds, 1);
  }, [items]);

  const combinedProbability = useMemo(() => {
    if (combinedOdds === 0) return 0;
    return (1 / combinedOdds) * 100;
  }, [combinedOdds]);

  const potentialReturn = useMemo(() => stake * combinedOdds, [stake, combinedOdds]);

  const value: SlipContextType = {
    items,
    slipId,
    stake,
    setStake,
    add,
    remove,
    has,
    count: items.length,
    combinedOdds,
    combinedProbability,
    potentialReturn,
    clear,
    setSlipId,
    toast,
    notify,
  };

  return <SlipContext.Provider value={value}>{children}</SlipContext.Provider>;
}

export function useSlip() {
  const ctx = useContext(SlipContext);
  if (!ctx) throw new Error('useSlip must be used within SlipProvider');
  return ctx;
}
