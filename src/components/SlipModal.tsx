// JSX runtime handles React import automatically
import { useSlip } from '../context/SlipContext';

export default function SlipModal({ onClose }: { onClose: () => void }) {
  const { items, clear } = useSlip();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-dark-surface w-[92%] max-w-md p-4 rounded-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Slip Preview</h3>
          <div className="flex gap-2">
            <button onClick={clear} className="btn-secondary px-3 py-1">Clear</button>
            <button onClick={onClose} className="btn-ghost px-3 py-1">Close</button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-auto">
          {items.map((it) => (
            <div key={it.matchId} className="p-3 bg-[#0f0f0f] rounded-md">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-400">{it.league}</div>
                  <div className="text-white font-medium">{it.homeTeam} vs {it.awayTeam}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{it.odds.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">{it.market}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
