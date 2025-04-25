import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define which paths are public (not requiring auth)
  const isPublicPath = path === '/login';

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // ✅ If the user is already logged in and tries to visit login page → redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ❌ If the user is not logged in and tries to visit a protected page → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Otherwise, allow request to proceed
  return NextResponse.next();
}

// Config: define which routes the middleware runs on
export const config = {
  matcher: [
    '/', 
    '/users', 
    '/users/:path*', 
    '/balance', 
    '/balance/:path*',
    '/users/manage', 
    '/users/balance', 
    '/login' // include /login for public path handling
  ],
};
