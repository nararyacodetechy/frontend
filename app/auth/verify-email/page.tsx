'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/services/authService';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      verifyEmail(token)
        .then(() => {
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => router.push('/auth/login'), 3000);
        })
        .catch((err: any) => {
          setError(err.message);
        });
    } else {
      setError('Invalid or missing verification token');
    }
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Verify Email</h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-center text-gray-600">
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </main>
  );
}