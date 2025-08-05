// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const TOKEN = 'token';


function isTokenValid(tokenExpiry: string | number): boolean {
  if (typeof tokenExpiry === "number") {
    return tokenExpiry > Date.now();
  }
  return new Date(tokenExpiry).getTime() > Date.now();
}

function createBearerToken(token: string): string {
  if (token) {
    return `Bearer ${token}`;
  }
  return "";
}

async function getNewAuthTokens(refreshToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return data.tokens;
}

async function validateAccessToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': createBearerToken(token),
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

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