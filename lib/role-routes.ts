// lib/role-routes.ts
import { RoleEnum } from '../types/role';

// Mapping of roles to their default redirect routes
export const roleBasedRoutes: { [key in RoleEnum]: string } = {
  [RoleEnum.USER]: '/my-page/user',
  [RoleEnum.CUSTOMER]: '/my-page/customer',
  [RoleEnum.PRODUCT_MANAGER]: '/dashboard/product-manager',
  [RoleEnum.DESIGNER]: '/dashboard/designer',
  [RoleEnum.DEVELOPER]: '/dashboard/developer',
  [RoleEnum.DEVOPS]: '/dashboard/devops',
  [RoleEnum.SALES]: '/dashboard/sales',
  [RoleEnum.MARKETING]: '/dashboard/marketing',
  [RoleEnum.ADMIN]: '/dashboard/admin',
};

// Mapping of routes to allowed roles
export const routeAccessMap: { [key: string]: RoleEnum[] } = {
  '/dashboard/admin': [RoleEnum.ADMIN],
  '/dashboard/developer': [RoleEnum.DEVELOPER, RoleEnum.ADMIN],
  '/dashboard/designer': [RoleEnum.DESIGNER, RoleEnum.ADMIN],
  '/dashboard/product-manager': [RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN],
  '/dashboard/devops': [RoleEnum.DEVOPS, RoleEnum.ADMIN],
  '/dashboard/sales': [RoleEnum.SALES, RoleEnum.ADMIN],
  '/dashboard/marketing': [RoleEnum.MARKETING, RoleEnum.ADMIN],
  '/my-page/user': [RoleEnum.USER],
  '/my-page/customer': [RoleEnum.CUSTOMER],
};