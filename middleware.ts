// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/auth-server';
import { RoleEnum } from './types/role';
import { PUBLIC_ROUTES } from '@/lib/public-routes';
import { DecodedToken } from './types/auth';

const roleBasedRoutes: { [key in RoleEnum]: string } = {
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

const routeAccessMap: { [key: string]: RoleEnum[] } = {
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // decode (note: jwt-decode, not signature-verified)
  let decoded: DecodedToken | null = null;
  try {
    decoded = decodeToken(token);
  } catch (e) {
    console.error('Token invalid/expired in middleware:', e);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (!decoded) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const role = decoded?.activeRole || RoleEnum.USER;
  const expectedRoute = roleBasedRoutes[role] || '/my-page/user';

  // Role-based route access
  for (const [prefix, allowedRoles] of Object.entries(routeAccessMap)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(expectedRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
