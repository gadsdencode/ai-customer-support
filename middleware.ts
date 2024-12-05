// /middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_FRONTEND_URL,
    'http://localhost:3000',
  ].filter(Boolean);

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Allow access for valid origins
  return NextResponse.next();
}

// Next.js specific configuration to tell the middleware which routes to apply on
export const config = {
  matcher: ['/api/:path*'],  // Apply to all API routes
};
