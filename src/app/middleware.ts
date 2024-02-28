import { NextResponse } from 'next/server'

export const config = {
  matcher: '/api/:path*',
}

export async function middleware() {
  const res = NextResponse.next()

  const corsHeaders = [
    ['Access-Control-Allow-Credentials', 'true'],
    ['Access-Control-Allow-Origin', '*'],
    ['Access-Control-Allow-Methods', 'GET,POST'],
    [
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    ],
  ]
  corsHeaders.forEach(([key, value]) => res.headers.append(key, value))

  return res
}
