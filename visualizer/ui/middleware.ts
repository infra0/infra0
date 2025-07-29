// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { isTokenValid } from './utils/function';
import { getNewAuthTokens, validateAccessToken } from './services/auth/auth.service';
import { TOKEN } from './constants/cookie';

export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get(TOKEN)?.value;

  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  try {
    const parsedToken = JSON.parse(tokenCookie);
    console.log({parsedToken})
    let { token: accessToken, expires: accessExpire } = parsedToken.access;
    const { token: refreshToken, expires: refreshExpire } = parsedToken.refresh;

    if (!isTokenValid(accessExpire)) {
      if (!isTokenValid(refreshExpire)) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      const newTokens = await getNewAuthTokens(refreshToken);

      accessToken = newTokens.access.token;

      const res = NextResponse.next();
      res.cookies.set(TOKEN, JSON.stringify(newTokens), {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
      });
    }

    const isAccessTokenValidated = await validateAccessToken(accessToken);
    if (isAccessTokenValidated) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/auth/signin', req.url));
  } catch (err) {
    console.error('middleware error', err);
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}

// Supports both a single string value or an array of matchers
export const config = {
    matcher: ['/', '/project/:path*'],
  }