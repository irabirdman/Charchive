import Link from 'next/link';
import { cookies } from 'next/headers';
import { cache } from 'react';

const getSession = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  return session?.value === 'authenticated';
});

export async function Navigation() {
  const isAuthenticated = await getSession();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" prefetch={true} className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ruutulian
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/"
              prefetch={true}
              className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/worlds"
              prefetch={true}
              className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
            >
              Worlds
            </Link>
            <Link
              href="/ocs"
              prefetch={true}
              className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
            >
              Characters
            </Link>
            <Link
              href="/lore"
              prefetch={true}
              className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
            >
              Lore
            </Link>
            <Link
              href="/timelines"
              prefetch={true}
              className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
            >
              Timelines
            </Link>
            {isAuthenticated ? (
              <Link
                href="/admin"
                prefetch={false}
                className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
              >
                Admin
              </Link>
            ) : (
              <Link
                href="/admin/login"
                prefetch={false}
                className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
