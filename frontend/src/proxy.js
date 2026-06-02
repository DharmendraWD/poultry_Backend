import { NextResponse } from 'next/server';

const GUEST_ONLY = ['/admin/login'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isLoggedIn = !!refreshToken;

  const isGuestOnly = GUEST_ONLY.includes(pathname);

  // If logged in user tries to access login page
  if (isGuestOnly && isLoggedIn) {
    return NextResponse.redirect(
      new URL('/admin/dashboard', request.url)
    );
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && !isGuestOnly) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', request.url);

      loginUrl.searchParams.set('from', pathname);

      return NextResponse.redirect(loginUrl);
    }

    // User is valid → allow requested URL
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};