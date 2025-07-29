import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookies, decodeToken, isAuthenticated, refreshAccessToken } from './lib/auth-server';
import { RoleEnum } from './types/role';
import { PUBLIC_ROUTES } from '@/lib/public-routes';

const roleBasedRoutes: { [key in RoleEnum]: string } = {
  [RoleEnum.USER]: '/',
  [RoleEnum.CUSTOMER]: '/my-page/customer',
  [RoleEnum.PRODUCT_MANAGER]: '/dashboard/product-manager',
  [RoleEnum.DESIGNER]: '/dashboard/designer',
  [RoleEnum.DEVELOPER]: '/dashboard/developer',
  [RoleEnum.DEVOPS]: '/dashboard/devops',
  [RoleEnum.SALES]: '/dashboard/sales',
  [RoleEnum.MARKETING]: '/dashboard/marketing',
  [RoleEnum.ADMIN]: '/dashboard/admin',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public routes
  const isPublic = PUBLIC_ROUTES.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Protected routes logic
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/my-page') || pathname.startsWith('/profile')) {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }

    const token = await getTokenFromCookies();
    const decoded = token ? decodeToken(token) : null;
    if (!decoded || !decoded.activeRole) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userRole = decoded.activeRole;
    const expectedRoute = roleBasedRoutes[userRole] || '/';

    // Role-based redirects
    if (
      expectedRoute &&
      !pathname.startsWith(expectedRoute) &&
      !pathname.startsWith(`/dashboard/${userRole}/profile`) &&
      !pathname.startsWith('/customer/profile')
    ) {
      return NextResponse.redirect(new URL(expectedRoute, request.url));
    }

    // Dashboard access
    if (pathname.startsWith('/dashboard')) {
      const role = pathname.split('/')[2] || '';
      if (role && role !== userRole && userRole !== RoleEnum.ADMIN && userRole !== RoleEnum.USER) {
        return NextResponse.redirect(new URL(expectedRoute, request.url));
      }
    }

    // my-page or customer/profile access
    if (
      (pathname.startsWith('/my-page') || pathname.startsWith('/customer/profile')) &&
      ![RoleEnum.CUSTOMER, RoleEnum.ADMIN].includes(userRole)
    ) {
      return NextResponse.redirect(new URL(expectedRoute, request.url));
    }

    // Customer specific redirect
    if (pathname.startsWith('/dashboard/customer') && userRole === RoleEnum.CUSTOMER) {
      return NextResponse.redirect(new URL('/my-page/customer', request.url));
    }

    // Prevent USER from dashboard
    if (pathname.startsWith('/dashboard') && userRole === RoleEnum.USER) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
