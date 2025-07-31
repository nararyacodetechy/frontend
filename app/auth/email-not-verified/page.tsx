'use client';

import { resendVerification } from '@/services/authService';
import { useState } from 'react';

export default function EmailNotVerifiedPage({ email }: { email: string }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    try {
      setError('');
      setMessage('');
      const res = await resendVerification(email);
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Your email is not verified yet</h2>
      <p className="mb-4">Please check your inbox or resend the verification link.</p>
      <button
        onClick={handleResend}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Resend Verification Email
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
