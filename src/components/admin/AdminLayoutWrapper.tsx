'use client';

import { usePathname } from 'next/navigation';
import { AdminNav } from './AdminNav';

export function AdminLayoutWrapper({ 
  children,
  userEmail 
}: { 
  children: React.ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();
  
  // Normalize pathname - remove trailing slash for comparison
  const normalized = pathname.replace(/\/$/, '');
  const isLoginPage = normalized === '/admin/login';

  // For login page, render children directly without nav/wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, require authentication
  // If no userEmail, middleware should have redirected, but render anyway
  // The page itself might show an error or the middleware will handle it
  return (
    <div className="min-h-screen bg-gray-900">
      {userEmail && <AdminNav userEmail={userEmail} />}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
