// types/user.ts
import { RoleEnum } from './role';
import { Profile } from './profile';

export interface Users {
  id: string;
  email: string;
  roles: RoleEnum[];
  activeRole: RoleEnum;
  isEmailVerified: boolean;
  profile?: Profile | null;
}