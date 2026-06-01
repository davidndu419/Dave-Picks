import { useState } from 'react';
import { useSlip } from '../context/SlipContext';
import SlipModal from './SlipModal';

export default function SlipPreviewBar() {
  const { count, combinedOdds, toast } = useSlip();
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-[70] w-[92%] max-w-md -translate-x-1/2 rounded border border-white/10 bg-black/90 p-3 text-center text-sm text-white shadow-lg pointer-events-auto">
          {toast}
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-dark-surface border-t border-dark-border p-3 flex items-center justify-between px-4 pointer-events-auto">
        <div className="text-sm text-gray-300">{count} selection{count>1?'s':''} • Combined: <span className="text-white font-semibold">{combinedOdds ? combinedOdds.toFixed(2) : '—'}</span></div>
        <button onClick={() => setOpen(true)} className="btn-primary px-4 py-2">View Slip</button>
      </div>
      {open && <SlipModal onClose={() => setOpen(false)} />}
    </>
  );
}
