import { NextResponse, type NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function copySessionCookies(
  response: NextResponse,
  setCookie: string | string[] | undefined,
): NextResponse {
  if (!setCookie) return response;

  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookies.forEach((cookie) => response.headers.append('set-cookie', cookie));
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  let isAuthenticated = Boolean(accessToken);
  let setCookie: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession(
        request.headers.get('cookie') ?? '',
      );
      isAuthenticated = sessionResponse.data.success;
      setCookie = sessionResponse.headers['set-cookie'];
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return copySessionCookies(
      NextResponse.redirect(new URL('/sign-in', request.url)),
      setCookie,
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return copySessionCookies(
      NextResponse.redirect(new URL('/', request.url)),
      setCookie,
    );
  }

  return copySessionCookies(NextResponse.next(), setCookie);
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
