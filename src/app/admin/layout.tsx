import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { AdminNav } from '@/components/admin/AdminNav';
import { headers } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get pathname from header set by middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLoginPage = pathname === '/admin/login';

  // Only render AdminNav if not on login page (to avoid requireAuth redirect loop)
  // AdminNav will handle its own auth check
  const adminNav = !isLoginPage ? <AdminNav /> : null;

  return <AdminLayoutWrapper adminNav={adminNav}>{children}</AdminLayoutWrapper>;
}
