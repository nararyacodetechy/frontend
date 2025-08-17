// app/dashboard/product-manager/account/layout.tsx
import AccountTabs from '@/components/account/AccountTabs';

export default function ProductManagerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Settings</h1>
      {/* hardcode role supaya tidak tergantung params */}
      <AccountTabs role="product-manager" />
      <section className="space-y-4">{children}</section>
    </div>
  );
}
