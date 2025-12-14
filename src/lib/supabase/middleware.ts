import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session-store'

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // CRITICAL: Check for login page FIRST - use exact match
  // Handle both with and without trailing slash
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  // If it's the login page, allow it through IMMEDIATELY
  if (isLoginPage) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Allow all API routes through
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // For all other admin routes, require authentication
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin-session');
    
    // No session cookie - redirect to login
    if (!sessionCookie?.value) {
      const loginUrl = url.clone();
      loginUrl.pathname = '/admin/login';
      // Use 302 (temporary redirect) to avoid caching issues
      return NextResponse.redirect(loginUrl, 302);
    }

    // Verify session token exists and is valid
    try {
      const session = await getSession(sessionCookie.value);
      
      if (!session) {
        const loginUrl = url.clone();
        loginUrl.pathname = '/admin/login';
        return NextResponse.redirect(loginUrl, 302);
      }
    } catch (error) {
      // If session check fails, redirect to login
      const loginUrl = url.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl, 302);
    }
  }

  // For all other routes, just pass through
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}
