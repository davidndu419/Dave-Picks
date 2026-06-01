import { useState } from 'react';
import type { Prediction } from '../types/prediction';
import { useSlip } from '../context/SlipContext';

function sportIcon(sport: string) {
  if (sport === 'Football') return '⚽';
  if (sport === 'Tennis') return '🎾';
  return '🏟️';
}

function confidenceColor(conf: number) {
  if (conf >= 85) return 'bg-green-500';
  if (conf >= 70) return 'bg-amber-400';
  return 'bg-orange-500';
}

export default function PredictionCard({ p }: { p: Prediction }) {
  const { add, has } = useSlip();
  const [expanded, setExpanded] = useState(false);

  const handleAdd = () => add(p);

  return (
    <div className="card p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="w-8 text-2xl">{p.rank}</div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{sportIcon(p.sport)}</div>
              <div>
                <div className="text-sm text-gray-400">{p.league}</div>
                <div className="text-white font-semibold">{p.homeTeam} vs {p.awayTeam}</div>
                <div className="text-xs text-gray-400">{new Date(p.matchTime).toLocaleString()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{p.odds.toFixed(2)}</div>
              <div className="text-xs text-gray-400">{p.market}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex-1 pr-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-2 flex-1 rounded ${confidenceColor(p.confidence)} relative overflow-hidden`}>
                  <div style={{ width: `${p.confidence}%` }} className="absolute inset-0" />
                </div>
                <div className="text-sm text-gray-300 w-12 text-right">{p.confidence}%</div>
              </div>
              <div className="text-sm text-gray-300 line-clamp-1">{p.geminiReasoning}</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => setExpanded((s) => !s)}
                className="btn-ghost px-3 py-2"
              >
                Why?
              </button>
              <button
                onClick={handleAdd}
                disabled={has(p.matchId)}
                className={`btn-primary px-4 py-2 ${has(p.matchId) ? 'opacity-60' : ''}`}
              >
                {has(p.matchId) ? 'Added' : 'Add To Slip'}
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 text-sm text-gray-300">
              {p.geminiReasoning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
