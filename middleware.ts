import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Gate /book-test behind sign-in. Checked here (not just in the page component) because
  // a plain document request - no client JS yet to act on an in-page redirect() - needs a
  // real HTTP redirect, which middleware always gives regardless of how the page itself
  // renders. We only check that Auth.js's session cookie is present (no JWT decode, so this
  // stays edge-runtime friendly and never touches the database); an expired/invalid cookie
  // still cannot reach the booking form, since the page itself re-checks the real session.
  if (path === '/book-test') {
    const hasSession =
      request.cookies.has('authjs.session-token') || request.cookies.has('__Secure-authjs.session-token');
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('callbackUrl', '/book-test');
      return NextResponse.redirect(url);
    }
  }

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)',
  ],
};