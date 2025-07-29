'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { RoleEnum } from '@/types/role';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', roles: [RoleEnum.USER] });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(form);
      setMessage('Registration successful! Please verify your email.');
      setTimeout(() => router.push('/auth/verify-email-sent'), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Role (Optional)</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.roles[0]}
              onChange={(e) => setForm({ ...form, roles: [e.target.value as RoleEnum] })}
            >
              <option value={RoleEnum.USER}>User</option>
              <option value={RoleEnum.CUSTOMER}>Customer</option>
              <option value={RoleEnum.DESIGNER}>Designer</option>
              <option value={RoleEnum.DEVELOPER}>Developer</option>
              <option value={RoleEnum.DEVOPS}>DevOps</option>
              <option value={RoleEnum.SALES}>Sales</option>
              <option value={RoleEnum.MARKETING}>Marketing</option>
              <option value={RoleEnum.PRODUCT_MANAGER}>Product Manager</option>
              <option value={RoleEnum.ADMIN}>Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>
        <div className="mt-4">
          <GoogleAuthButton />
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}