export interface Profile {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    activeRole: string;
    adminPrivileges?: string[];
}