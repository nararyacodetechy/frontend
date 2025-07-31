import { RoleEnum } from '@/types/role';

export type Role = RoleEnum;

export function isAdmin(role?: Role) {
  return role === RoleEnum.ADMIN;
}

export function isDeveloper(role?: Role) {
  return role === RoleEnum.DEVELOPER;
}

export function isDesigner(role?: Role) {
  return role === RoleEnum.DESIGNER;
}

export function isSales(role?: Role) {
  return role === RoleEnum.SALES;
}

export function isDevOps(role?: Role) {
  return role === RoleEnum.DEVOPS;
}

export function isCustomer(role?: Role) {
  return role === RoleEnum.CUSTOMER;
}

export function isUser(role?: Role) {
  return role === RoleEnum.USER;
}

export function getDashboardPathByRole(role: Role) {
  switch (role) {
    case RoleEnum.USER:
      return '/';
    case RoleEnum.CUSTOMER:
      return '/my-page/customer';
    case RoleEnum.ADMIN:
      return '/dashboard/admin';
    case RoleEnum.DEVELOPER:
      return '/dashboard/developer';
    case RoleEnum.DESIGNER:
      return '/dashboard/designer';
    case RoleEnum.SALES:
      return '/dashboard/sales';
    case RoleEnum.DEVOPS:
      return '/dashboard/devops';
    case RoleEnum.MARKETING:
      return '/dashboard/marketing';
    case RoleEnum.PRODUCT_MANAGER:
      return '/dashboard/product-manager';
    default:
      return '/';
  }
}