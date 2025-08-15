// types/profile.ts

export interface Profile {
  id: string;
  userId: string; // Maps to user_id foreign key
  fullName: string | null; // Nullable to match user_profiles.full_name
  username?: string; // Nullable to match user_profiles
  nik?: string;
  address?: string;
  phone?: string;
  company?: string;
  imageProfile?: string;
}