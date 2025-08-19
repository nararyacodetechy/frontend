// app/my-page/user/account/layout.tsx
import { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-8 py-8 bg-white min-h-screen">
      {children}
    </div>
  );
}
