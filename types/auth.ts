import { Dispatch, SetStateAction } from 'react';
import { RoleEnum } from './role';

export interface Users {
  id: string;
  email: string;
  fullName: string | null;
  roles: RoleEnum[];
  activeRole: RoleEnum;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
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
  switchRole: (role: RoleEnum) => void;
}
