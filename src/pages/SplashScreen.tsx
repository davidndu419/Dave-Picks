import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';

export function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthGuard();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/app', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-accent-green mb-4">
          Dave Picks
        </h1>
        <p className="text-gray-400 mb-12">Sports Prediction Intelligence</p>
        <div className="flex justify-center">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-dark-border border-t-accent-green rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
