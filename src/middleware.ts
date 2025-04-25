import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login';
  //const token = request.cookies.get('token')?.value || '';

  //Check for token in local storage
  const hasToken = !!request.cookies.get('token')?.value || false;


  if (isPublicPath && hasToken) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/users', '/users/:path*', '/balance', '/balance/:path*','/users/manage','/users/balance'],
};

