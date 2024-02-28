import { matchUrl } from '@bo-carey/urlglob'
import { NextRequest, NextResponse } from 'next/server'

const CORS_PREFIX = 'Access-Control-Allow-'
const DEV_ORIGINS = ['https://blank.page', 'null']
const BASE_ORIGIN = 'https://**mobius.cloud**'
const IGNORED_PATHS = ['passwordreset', 'login']
const CORS_BASE_OPTION = {
  [getCorsKey('Headers')]: 'Content-Type, Authorization',
  [getCorsKey('Methods')]: 'POST,OPTIONS',
}

export const config = {
  matcher: '/api/:path*',
}

export async function middleware(request: NextRequest) {
  const isAllowedOrigin = checkOrigin(request)
  const response = NextResponse.next()
  if (isAllowedOrigin) response.headers.set(getCorsKey('Origin'), origin)
  Object.entries(CORS_BASE_OPTION).forEach(([key, value]) => response.headers.set(key, value))
  return response
}

function checkOrigin(request: NextRequest) {
  const origin = request.headers.get('origin') as string
  const ignoredOrigins = IGNORED_PATHS.map((path) => `${BASE_ORIGIN}${path}**`)
  const ignoredMatches = ignoredOrigins.map((value) => matchUrl(origin, value))
  const devMatches = DEV_ORIGINS.map((value) => matchUrl(origin, value))

  const isDevMode = process.env.NODE_ENV === 'development'
  const isDevOrigin = devMatches.some((value) => value)
  const isIgnoredOrigin = ignoredMatches.some((value) => !value)
  const isBaseOrigin = matchUrl(origin, BASE_ORIGIN)
  const isAllowedOrigin = (isBaseOrigin && !isIgnoredOrigin) || (isDevMode && isDevOrigin)

  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight)
    return NextResponse.json(
      {},
      {
        headers: {
          ...(isAllowedOrigin && { [getCorsKey('Origin')]: origin }),
          ...CORS_BASE_OPTION,
        },
      },
    )

  return isAllowedOrigin
}

function getCorsKey(postfix: string) {
  return CORS_PREFIX + postfix
}
