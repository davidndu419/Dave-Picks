import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, isValidEmail } from '../utils/auth';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
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
          Reset Password
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Enter your email to receive a password reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-accent-red bg-opacity-10 border border-accent-red rounded-btn text-accent-red text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-accent-green bg-opacity-10 border border-accent-green rounded-btn text-accent-green text-sm">
              Password reset email sent! Check your inbox.
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-accent-green hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
