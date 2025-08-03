import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Example: Protect specific API routes (optional)
  // if (path.startsWith('/api/protected/')) {
  //   const token = request.cookies.get('auth-token');
  //   if (!token) {
  //     return new NextResponse(
  //       JSON.stringify({ error: 'Unauthorized' }),
  //       { 
  //         status: 401, 
  //         headers: { 'Content-Type': 'application/json' } 
  //       }
  //     );
  //   }
  // }

  // Allow all other API routes and requests to proceed normally
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};