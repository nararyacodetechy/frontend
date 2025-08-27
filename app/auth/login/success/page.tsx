// app/auth/login/success/page.tsx
import { redirect } from 'next/navigation';
import { getTokenFromCookies, decodeToken } from '@/lib/auth-server';
import { RoleEnum } from '@/types/role';
import { headers } from 'next/headers';

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

export default async function LoginSuccessPage() {
  const cookie = (await headers()).get('cookie') || '';
  const cookies = cookie.split(';').map((c) => c.trim());
  const accessTokenCookie = cookies.find((c) => c.startsWith('access_token_'));
  const token = accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
  const decoded = token ? decodeToken(token) : null;

  if (!decoded) {
    redirect('/auth/login?error=profile-fetch-failed');
  }

  const redirectTo = roleBasedRoutes[decoded.activeRole] || '/my-page/user';
  redirect(redirectTo);
}