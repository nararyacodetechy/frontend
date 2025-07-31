// lib/jwt-client.ts
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/auth';

export function decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
}
