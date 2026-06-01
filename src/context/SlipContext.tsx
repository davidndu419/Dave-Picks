/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Prediction } from '../types/prediction';

type SlipItem = Prediction;

type SlipContextType = {
  items: SlipItem[];
  add: (p: Prediction) => boolean;
  has: (matchId: string) => boolean;
  count: number;
  combinedOdds: number;
  clear: () => void;
};

const SlipContext = createContext<SlipContextType | undefined>(undefined);

export function SlipProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SlipItem[]>([]);

  const add = (p: Prediction) => {
    if (items.find((i) => i.matchId === p.matchId)) return false;
    setItems((s) => [...s, p]);
    return true;
  };

  const has = (matchId: string) => items.some((i) => i.matchId === matchId);

  const clear = () => setItems([]);

  const combinedOdds = useMemo(() => {
    if (items.length === 0) return 0;
    return items.reduce((acc, i) => acc * i.odds, 1);
  }, [items]);

  const value: SlipContextType = {
    items,
    add,
    has,
    count: items.length,
    combinedOdds,
    clear,
  };

  return <SlipContext.Provider value={value}>{children}</SlipContext.Provider>;
}

export function useSlip() {
  const ctx = useContext(SlipContext);
  if (!ctx) throw new Error('useSlip must be used within SlipProvider');
  return ctx;
}
