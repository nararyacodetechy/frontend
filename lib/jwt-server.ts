// lib/jwt-server.ts
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is undefined');
  throw new Error('Missing JWT_SECRET');
} else {
  console.log('✅ JWT_SECRET is defined:', process.env.JWT_SECRET);
}


export function signToken(payload: object, expiresIn: string = '1h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}


export function verifyToken(token: string): Promise<DecodedToken> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        return reject(err);
      }
      resolve(decoded as DecodedToken);
    });
  });
}
