import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSlip } from '../context/SlipContext';
import { createSlip, updateSlip } from '../services/slipService';
import type { SlipStatus } from '../types/slip';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getProbabilityColor = (probability: number) => {
  if (probability > 40) return 'text-green-400';
  if (probability >= 25) return 'text-amber-400';
  return 'text-orange-400';
};

export default function SlipModal({ onClose }: { onClose: () => void }) {
  const { user, profile } = useAuth();
  const {
    items,
    remove,
    combinedOdds,
    combinedProbability,
    potentialReturn,
    stake,
    setStake,
    slipId,
    setSlipId,
    notify,
  } = useSlip();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = items.length >= 2;

  const bookingCode = `DAVE PICKS — ${formatDate(new Date())}\n${items
    .map(
      (item) => `${item.homeTeam} vs ${item.awayTeam} | ${item.market} | ${item.odds.toFixed(2)}`
    )
    .join('\n')}\n\nCombined Odds: ${combinedOdds.toFixed(2)}\nStake: ${profile?.currency ?? ''} ${stake.toFixed(2)}\nPotential Return: ${profile?.currency ?? ''} ${potentialReturn.toFixed(2)}`;

  const handleSave = async () => {
    setError(null);
    if (!canSave) {
      setError('Add at least 2 selections before saving.');
      return;
    }
    if (!user || !profile) {
      setError('Unable to save slip. Please sign in again.');
      return;
    }
    setIsSaving(true);
    const payload = {
      date: formatDate(new Date()),
      selections: items,
      combinedOdds,
      combinedProbability,
      stake,
      currency: profile.currency,
      potentialReturn,
      status: 'saved' as SlipStatus,
    };

    let savedId: string | null = null;
    if (slipId) {
      const success = await updateSlip(user.uid, slipId, {
        selections: items,
        combinedOdds,
        combinedProbability,
        stake,
        currency: profile.currency,
        potentialReturn,
        status: 'saved',
      });
      if (success) savedId = slipId;
    } else {
      savedId = await createSlip(user.uid, payload);
    }

    if (!savedId) {
      setError('Failed to save slip.');
      setIsSaving(false);
      return;
    }

    setSlipId(savedId);
    notify('Slip Saved');
    setIsSaving(false);
  };

  const handleMarkAsPlaying = async () => {
    setError(null);
    if (!canSave) {
      setError('Add at least 2 selections before marking as playing.');
      return;
    }
    if (!user || !profile) {
      setError('Unable to update slip. Please sign in again.');
      return;
    }
    setIsSaving(true);
    const payload = {
      date: formatDate(new Date()),
      selections: items,
      combinedOdds,
      combinedProbability,
      stake,
      currency: profile.currency,
      potentialReturn,
      status: 'played' as SlipStatus,
    };

    let savedId: string | null = null;
    if (slipId) {
      const success = await updateSlip(user.uid, slipId, {
        selections: items,
        combinedOdds,
        combinedProbability,
        stake,
        currency: profile.currency,
        potentialReturn,
        status: 'played',
      });
      if (success) savedId = slipId;
    } else {
      savedId = await createSlip(user.uid, payload);
    }

    if (!savedId) {
      setError('Failed to mark slip as playing.');
      setIsSaving(false);
      return;
    }

    setSlipId(savedId);
    notify('Slip Marked As Playing');
    setIsSaving(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingCode);
      notify('Copied');
    } catch {
      setError('Copy failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="relative z-[90] bg-dark-surface w-full max-w-lg rounded-card p-4 shadow-lg">
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Accumulator Builder</h3>
            <button onClick={onClose} className="btn-ghost px-3 py-1">Close</button>
          </div>
          {error && <div className="rounded bg-orange-600/20 px-3 py-2 text-orange-200">{error}</div>}
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-auto pb-4">
          {items.length === 0 ? (
            <div className="rounded border border-dashed border-gray-700 bg-[#090909] p-6 text-center text-gray-400">
              No selections added yet
            </div>
          ) : (
            items.map((item) => (
              <div key={item.matchId} className="flex items-start justify-between gap-4 rounded-md border border-[#222] bg-[#0d0d0d] p-3">
                <div>
                  <div className="text-sm text-gray-400">{item.league}</div>
                  <div className="text-white font-semibold">{item.homeTeam} vs {item.awayTeam}</div>
                  <div className="text-xs text-gray-400">{item.market}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">{item.odds.toFixed(2)}</div>
                  <button onClick={() => remove(item.matchId)} className="mt-2 text-xs text-amber-300 underline">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-[#222] bg-[#0d0d0d] p-3">
            <div className="text-sm text-gray-400">Combined Odds</div>
            <div className="font-mono text-2xl text-white">{combinedOdds.toFixed(2)}</div>
          </div>
          <div className="rounded-md border border-[#222] bg-[#0d0d0d] p-3">
            <div className="text-sm text-gray-400">Probability</div>
            <div className={`font-mono text-2xl ${getProbabilityColor(combinedProbability)}`}>
              {combinedProbability.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-md border border-[#222] bg-[#0d0d0d] p-3 md:col-span-2">
            <label className="text-sm text-gray-400">Stake ({profile?.currency ?? 'USD'})</label>
            <input
              type="number"
              value={stake}
              min={0}
              onChange={(e) => setStake(Number(e.target.value))}
              className="mt-2 w-full rounded border border-[#333] bg-black px-3 py-2 text-white font-mono"
            />
          </div>
          <div className="rounded-md border border-[#222] bg-[#0d0d0d] p-3 md:col-span-2">
            <div className="text-sm text-gray-400">Potential Return</div>
            <div className="font-mono text-2xl text-white">{profile?.currency ?? 'USD'} {potentialReturn.toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className="btn-primary px-4 py-3 disabled:opacity-50"
            >
              Save For Later
            </button>
            <button
              type="button"
              onClick={handleMarkAsPlaying}
              disabled={!canSave || isSaving}
              className="btn-secondary px-4 py-3 disabled:opacity-50"
            >
              Mark As Playing
            </button>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="btn-ghost px-4 py-3"
          >
            Copy Booking Code
          </button>
        </div>
      </div>
    </div>
  );
}
