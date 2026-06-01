import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-6 py-8 pb-24">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="card p-6 mb-6">
        <p className="text-gray-400 text-sm mb-2">Logged in as</p>
        <p className="text-white font-semibold mb-1">{profile?.name || user?.displayName || user?.email}</p>
        <p className="text-gray-500 text-sm">{profile?.email || user?.email}</p>
        <div className="mt-4 text-sm text-gray-300">
          <p>Default stake: <span className="text-white font-medium">{profile?.defaultStake ?? '—'}</span></p>
          <p>Currency: <span className="text-white font-medium">{profile?.currency ?? '—'}</span></p>
          <p>Confidence threshold: <span className="text-white font-medium">{profile?.confidenceThreshold ?? '—'}%</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          Settings coming in Batch 7
        </p>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="btn-secondary w-full py-3 font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}
