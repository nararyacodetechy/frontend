// app/my-page/user/page.tsx
import MyPageLayout from '@/components/layout/MyPageLayout';
import Link from 'next/link';

export default function UserMyPage() {
  return (
    <MyPageLayout>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl font-bold mt-4">Welcome, User!</h1>
          <p className="text-gray-600 mt-2">This is your dashboard. Choose a feature below.</p>
        </div>

        {/* Quick Access Tiles */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link
            href="/my-page/user/order"
            className="bg-white shadow rounded-lg p-4 flex flex-col items-start gap-1 hover:shadow-md transition"
          >
            <span className="font-semibold">Orders</span>
            <span className="text-xs text-gray-500">View your orders</span>
          </Link>

          <Link
            href="/my-page/user/projects"
            className="bg-white shadow rounded-lg p-4 flex flex-col items-start gap-1 hover:shadow-md transition"
          >
            <span className="font-semibold">Projects</span>
            <span className="text-xs text-gray-500">Manage your projects</span>
          </Link>
          <Link
            href="/my-page/user/account/profile"
            className="bg-white shadow rounded-lg p-4 flex flex-col items-start gap-1 hover:shadow-md transition"
          >
            <span className="font-semibold">Account</span>
            <span className="text-xs text-gray-500">Profile & Security</span>
          </Link>
        </div>
      </div>
    </MyPageLayout>
  );
}
