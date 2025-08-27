// types/auth.ts
import { Dispatch, SetStateAction } from 'react';
import { RoleEnum } from './role';
import { Users } from './user';

export interface RegisterPayload {
  email: string;
  password: string;
  profile: {
    fullName: string;
    username?: string;
    nik?: string;
    address?: string;
    phone?: string;
    company?: string;
    imageProfile?: string;
  };
  roles?: RoleEnum[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: Users;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface AuthContextType {
  user: Users | null;
  setUser: Dispatch<SetStateAction<Users | null>>;
  login: (user: Users) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface DecodedToken {
  sub: string; // Changed from userId to sub to match JWT payload
  email: string;
  activeRole: RoleEnum;
  iat?: number;
  exp?: number;
}