import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import mock from '../data/mockPredictions';
import PredictionCard from '../components/PredictionCard';
import { SlipProvider } from '../context/SlipContext';
import SlipPreviewBar from '../components/SlipPreviewBar';

const FILTERS = ['All', 'Football', 'Tennis', 'High Confidence'];

export function TodayPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [sort, setSort] = useState<'confidence' | 'rank'>('confidence');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const items = useMemo(() => {
    let arr = mock.slice();
    if (filter === 'Football') arr = arr.filter((i) => i.sport === 'Football');
    if (filter === 'Tennis') arr = arr.filter((i) => i.sport === 'Tennis');
    if (filter === 'High Confidence') arr = arr.filter((i) => i.confidence >= 85);
    if (sort === 'confidence') arr.sort((a, b) => b.confidence - a.confidence);
    else arr.sort((a, b) => a.rank - b.rank);
    return arr;
  }, [filter, sort]);

  return (
    <SlipProvider>
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dave Picks</h2>
          <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex gap-3 mb-4 items-center">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded ${filter===f?'bg-[#00FF87] text-black':'bg-[#111] text-gray-300'}`}>
              {f}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-400">Sort</label>
            <select
              value={sort}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as 'confidence' | 'rank')}
              className="bg-[#0b0b0b] px-2 py-1 rounded"
            >
              <option value="confidence">By Confidence</option>
              <option value="rank">By Rank</option>
            </select>
          </div>
        </div>

        <div>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#0b0b0b] rounded mb-3 animate-pulse" />
            ))
          ) : (
            items.map((p) => <PredictionCard key={p.matchId} p={p} />)
          )}
        </div>

        <SlipPreviewBar />
      </div>
    </SlipProvider>
  );
}

export default TodayPage;
