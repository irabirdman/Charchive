'use client';

import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    // Call logout API to clear session cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    // Redirect to login page
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="hover:text-gray-300 transition-colors"
    >
      Sign Out
    </button>
  );
}
