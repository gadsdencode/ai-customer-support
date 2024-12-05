/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/proxy/route.ts

import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
  
  // Export handlers with CORS
  export const OPTIONS = async (req: NextRequest) => {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  };

  export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), {
        headers: CORS_HEADERS,
      });
    } catch (error) {
      console.error('Proxy POST error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }
  };

  export const GET = async (req: NextRequest) => {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  };
