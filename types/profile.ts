// types/profile.ts

export interface Profile {
  id: string | null;
  userId: string;
  fullName: string | null;
  username: string | null;
  nik: string | null;
  address: string | null;
  phone: string | null;
  company: string | null;
  imageProfile: string | null;
}
