import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session-store'

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  })

  // Check if accessing admin routes (excluding login page)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check if admin session cookie exists and is valid
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie || !sessionCookie.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Verify session token
    const session = getSession(sessionCookie.value);
    
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Set pathname header for use in layouts
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response
}
