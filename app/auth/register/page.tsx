'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/authService';
import RegisterForm from '@/components/auth/RegisterForm';
import { RoleEnum } from '@/types/role';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (formData: { email: string; password: string; fullName: string; roles: RoleEnum[] }) => {
    try {
      const response = await register(formData);
      setMessage('Registration successful! Please verify your email.');
      setTimeout(() => router.push('/auth/verify-email-sent'), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm onSubmit={handleRegister} error={error} message={message} />
    </main>
  );
}