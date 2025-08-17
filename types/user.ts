// types/user.ts
import { RoleEnum } from './role';
import { Profile } from './profile';

export type AuthProvider = 'local' | 'google' | 'github';

export interface Users {
  id: string;
  email: string;
  roles: RoleEnum[];
  activeRole: RoleEnum;
  isEmailVerified: boolean;
  profile: Profile | null;

  // sementara untuk simulasi
  provider?: AuthProvider;
}