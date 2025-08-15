'use client';

import { useState } from 'react';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { RoleEnum } from '@/types/role';

interface RegisterFormProps {
  onSubmit: (formData: { email: string; password: string; roles: RoleEnum[] }) => void;
  error: string;
  message: string;
}

export default function RegisterForm({ onSubmit, error, message }: RegisterFormProps) {
  const [form, setForm] = useState({ email: '', password: '', roles: [RoleEnum.USER] });
  const [showManualForm, setShowManualForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      
      <div className="mt-4">
        <GoogleAuthButton />
      </div>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Prefer manual registration?{' '}
        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          className="cursor-pointer text-blue-500 hover:underline"
        >
          {showManualForm ? 'Hide manual form' : 'Show manual form'}
        </button>
      </p>

      {showManualForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}