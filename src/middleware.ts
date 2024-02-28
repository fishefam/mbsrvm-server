import { matchUrl } from '@bo-carey/urlglob'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = ['https://**mobius.cloud**', 'https://blank.page', 'null']

const CORS_BASE_OPTION = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

export const config = {
  matcher: '/api/:path*',
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? 'null'
  const matches = ALLOWED_ORIGINS.map((url) => matchUrl(origin, url))
  const isAllowedOrigin = matches.some((value) => value)

  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...CORS_BASE_OPTION,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  const response = NextResponse.next()

  if (isAllowedOrigin) response.headers.set('Access-Control-Allow-Origin', origin)
  Object.entries(CORS_BASE_OPTION).forEach(([key, value]) => response.headers.set(key, value))

  return response
}
