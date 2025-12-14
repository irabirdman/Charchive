import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/auth/session-store';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    // Delete session from store if it exists
    if (sessionCookie?.value) {
      await deleteSession(sessionCookie.value);
    }

    const response = NextResponse.json({ success: true });

    // Clear the admin session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (err) {
    logger.error('Auth', 'Logout error', err);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
