'use client';

import { loginWithGoogle } from '@/services/authService';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleAuthButton() {

  return (
    <button
      onClick={loginWithGoogle}
      className="flex items-center cursor-pointer gap-2 mt-4 w-full justify-center py-2 px-4 border border-gray-400 rounded"
    >
      <FcGoogle size={24} />
      Continue with Google
    </button>
  );
}
