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

// Mapping prefix to allowed roles
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
  const response = NextResponse.next();
  const token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Public route, skip protection
  const isPublic = PUBLIC_ROUTES.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  if (isPublic) return response;

  // Decode token if exists
  let decoded: DecodedToken | null = null;
  if (token) {
    decoded = decodeToken(token);
  }

  // Refresh token if invalid or expired
  if (!decoded && refreshToken) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      const data = await res.json();
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      decoded = decodeToken(newAccessToken);
      if (!decoded) return NextResponse.redirect(new URL('/auth/login', request.url));

      // Set new cookies
      response.cookies.set('token', newAccessToken, {
        path: '/',
        maxAge: 15 * 60,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      if (newRefreshToken) {
        response.cookies.set('refreshToken', newRefreshToken, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
    } catch (e) {
      console.error('Failed to refresh token in middleware', e);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Still no valid token
  if (!decoded) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const role = decoded.activeRole;
  const expectedRoute = roleBasedRoutes[role] || '/';

  // Role-specific access control
  for (const [prefix, allowedRoles] of Object.entries(routeAccessMap)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(expectedRoute, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
