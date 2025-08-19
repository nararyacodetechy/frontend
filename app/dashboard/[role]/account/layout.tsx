'use client';

import { useParams } from 'next/navigation';
import AccountTabs from '@/components/dashboard/account/AccountTabs';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const role = (params.role as string) || 'user';

  return (
    <div>
      <AccountTabs role={role} />
      <div className="mt-6">{children}</div>
    </div>
  );
}