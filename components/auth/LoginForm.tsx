// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import GoogleAuthButton from './GoogleAuthButton';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth(); // Ensure this import is correct
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  const isFormComplete = form.email.trim() !== '' && form.password.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form);

      if (response.user && !response.user.isEmailVerified) {
        router.push(`/auth/email-not-verified?email=${form.email}`);
        return;
      }

      await setAuthUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mt-4">
        <GoogleAuthButton />
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Prefer manual login?{' '}
        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          className="text-blue-500 hover:underline"
        >
          {showManualForm ? 'Hide manual form' : 'Show manual form'}
        </button>
      </p>

      {showManualForm && (
        <div className="flex flex-col">
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isFormComplete}
              className={`w-full bg-blue-600 text-white py-2 rounded-md transition-colors ${
                loading || !isFormComplete
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Forgot your password?{' '}
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline">
              Reset Password
            </Link>
          </p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="mt-2 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}