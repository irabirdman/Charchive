import Link from 'next/link';
import { requireAuth } from '@/lib/auth/require-auth';
import { SignOutButton } from './SignOutButton';

export async function AdminNav() {
  const user = await requireAuth();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="text-xl font-bold">
            Admin Home
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/admin/worlds"
              className="hover:text-gray-300 transition-colors"
            >
              Worlds
            </Link>
            <Link
              href="/admin/ocs"
              className="hover:text-gray-300 transition-colors"
            >
              OCs
            </Link>
            <Link
              href="/admin/timelines"
              className="hover:text-gray-300 transition-colors"
            >
              Timelines
            </Link>
            <Link
              href="/admin/world-lore"
              className="hover:text-gray-300 transition-colors"
            >
              Lore
            </Link>
            <Link
              href="/admin/fields"
              className="hover:text-gray-300 transition-colors"
            >
              Fields
            </Link>
            <Link
              href="/admin/dropdown-options"
              className="hover:text-gray-300 transition-colors"
            >
              Options
            </Link>
            <Link
              href="/admin/stats"
              className="hover:text-gray-300 transition-colors"
            >
              Stats
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
              <span className="text-sm text-gray-400">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
