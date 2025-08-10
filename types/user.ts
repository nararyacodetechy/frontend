import { RoleEnum } from "./role";

export interface Users {
    id: string;
    email: string;
    fullName: string | null;
    roles: RoleEnum[];
    activeRole: RoleEnum;
    isEmailVerified: boolean;
}

export interface Profile {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    activeRole: string;
    adminPrivileges?: string[];
}