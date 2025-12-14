import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { requireAuth } from '@/lib/auth/require-auth';
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

  // Only get user email if not on login page (to avoid requireAuth redirect loop)
  let userEmail: string | null = null;
  if (!isLoginPage) {
    try {
      const user = await requireAuth();
      userEmail = user.email;
    } catch {
      // If auth fails, userEmail will be null (will be handled by requireAuth redirect)
      userEmail = null;
    }
  }

  return <AdminLayoutWrapper userEmail={userEmail}>{children}</AdminLayoutWrapper>;
}
