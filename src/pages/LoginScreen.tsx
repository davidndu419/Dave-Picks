import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, isValidEmail } from '../utils/auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/app', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-bg px-6 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-accent-green mb-2 text-center">
          Dave Picks
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Sports Prediction Intelligence
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          {error && (
            <div className="p-4 bg-accent-red bg-opacity-10 border border-accent-red rounded-btn text-accent-red text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-base"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-base"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-bg text-gray-400">Or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="btn-secondary w-full py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <text x="0" y="15" fontSize="16" fontWeight="bold" fill="white">
              G
            </text>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            <Link
              to="/forgot-password"
              className="text-accent-green hover:underline"
            >
              Forgot password?
            </Link>
          </p>
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-green hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
