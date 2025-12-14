'use client';

import { usePathname } from 'next/navigation';

export function AdminLayoutWrapper({ 
  children,
  adminNav 
}: { 
  children: React.ReactNode;
  adminNav: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {adminNav}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}


