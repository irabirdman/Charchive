import Link from 'next/link';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { NavigationClient } from './NavigationClient';

const getSession = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');
  return session?.value === 'authenticated';
});

export async function Navigation() {
  const isAuthenticated = await getSession();

  return <NavigationClient isAuthenticated={isAuthenticated} />;
}
