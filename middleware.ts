// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeToken } from './lib/auth-server';
import { PUBLIC_ROUTES } from './lib/public-routes';
import { roleBasedRoutes, routeAccessMap } from './lib/role-routes';
import { DecodedToken } from './types/auth';
import { RoleEnum } from './types/role';

// Middleware function to handle authentication and role-based routing
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes without authentication
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Retrieve access token from cookies
  const token = request.cookies.get('access_token')?.value;
  // Log token presence for debugging (avoid logging sensitive token data in production)
  console.debug('Middleware: Checking token presence', { tokenExists: !!token });

  // Redirect to login if no token is found
  if (!token) {
    console.warn('Middleware: No access token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Decode token to extract user information
  let decoded: DecodedToken | null = null;
  try {
    decoded = decodeToken(token);
  } catch (error) {
    console.error('Middleware: Token decoding failed', { error });
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to login if token decoding returns null
  if (!decoded) {
    console.warn('Middleware: Decoded token is null, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Determine user's active role, default to USER if not specified
  const role = decoded.activeRole || RoleEnum.USER;
  // Get the expected route for the user's role
  const expectedRoute = roleBasedRoutes[role] || '/my-page/user';
  console.debug('Middleware: User role and expected route', { role, expectedRoute });

  // Check if the requested route is accessible for the user's role
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

  // Allow request to proceed if all checks pass
  console.debug('Middleware: Access granted, proceeding to requested route', { pathname });
  return NextResponse.next();
}

// Middleware configuration to match routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};