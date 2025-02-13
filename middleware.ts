import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};