// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/auth-server';
import { PUBLIC_ROUTES } from './lib/public-routes';
import { roleBasedRoutes, routeAccessMap } from './lib/role-routes';
import { DecodedToken } from './types/auth';
import { RoleEnum } from './types/role';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    console.debug('Middleware: Public route, allowing access', { pathname });
    return NextResponse.next();
  }

  // Look for any access_token_<userId> cookie
  const cookies = request.cookies.getAll();
  const tokenCookie = cookies.find((c) => c.name.startsWith('access_token_'));
  const token = tokenCookie?.value;

  console.debug('Middleware: Checking token presence', { tokenExists: !!token, token });

  if (!token) {
    console.warn('Middleware: No access token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  let decoded: DecodedToken | null = null;
  try {
    decoded = decodeToken(token);
    console.debug('Middleware: Decoded token', { decoded });
  } catch (error) {
    console.error('Middleware: Token decoding failed', { error });
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (!decoded) {
    console.warn('Middleware: Decoded token is null, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const role = decoded.activeRole || RoleEnum.USER;
  const expectedRoute = roleBasedRoutes[role] || '/my-page/user';
  console.debug('Middleware: User role and expected route', { role, expectedRoute });

  for (const [prefix, allowedRoles] of Object.entries(routeAccessMap)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      console.warn('Middleware: Access denied, redirecting to expected route', {
        pathname,
        role,
        expectedRoute,
      });
      return NextResponse.redirect(new URL(expectedRoute, request.url));
    }
  }

  console.debug('Middleware: Access granted, proceeding to requested route', { pathname });
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};