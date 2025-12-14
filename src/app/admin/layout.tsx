import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import { checkAuth } from '@/lib/auth/require-auth';

// Force dynamic rendering to ensure middleware and auth checks run
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use checkAuth (doesn't redirect) - middleware handles auth redirects
  // Client-side AdminLayoutWrapper will handle login page detection and rendering
  const user = await checkAuth();
  const userEmail = user?.email || null;

  return <AdminLayoutWrapper userEmail={userEmail}>{children}</AdminLayoutWrapper>;
}
