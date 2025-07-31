// app/auth/layout.tsx
import { AuthProvider } from '@/context/AuthContext'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </AuthProvider>
  )
}
