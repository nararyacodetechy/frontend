export interface Users {
    id: string;
    email: string;
    fullName: string | null;
    roles: RoleEnum[];
    activeRole: RoleEnum;
}

export enum RoleEnum {
    USER = 'user',
    CUSTOMER = 'customer',
    SALES = 'sales',
    MARKETING = 'marketing',
    PRODUCT_MANAGER = 'product-manager',
    DESIGNER = 'designer',
    DEVELOPER = 'developer',
    DEVOPS = 'devops',
    ADMIN = 'admin',
}