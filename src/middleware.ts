import { matchUrl } from '@bo-carey/urlglob'
import { NextRequest, NextResponse } from 'next/server'

import { TIncomingHeaders } from './type/generic'

const CORS_PREFIX = 'Access-Control-Allow-'
const DEV_ORIGINS = ['https://blank.page**', 'null']
const BASE_ORIGIN = 'https://**mobius.cloud**'
const CORS_BASE_OPTION = {
  [makeCorsHeaderName('Headers')]: '*',
  [makeCorsHeaderName('Methods')]: 'POST',
}

export const config = {
  matcher: '/api/:path*',
}

export async function middleware(request: NextRequest) {
  const { isAllowedOrigin, isPreflight, origin } = checkOrigin(request)
  console.log(process.env.ENV)
  if (isPreflight && !isAllowedOrigin) return Response.json({}, { status: 401 })
  if (isPreflight && isAllowedOrigin)
    return Response.json({}, { headers: { [makeCorsHeaderName('Origin')]: origin, ...CORS_BASE_OPTION } })
  return passOnRequest(origin, isAllowedOrigin)
}

function passOnRequest(origin: string, isAllowedOrigin: boolean) {
  const response = NextResponse.next()
  if (isAllowedOrigin) response.headers.set(makeCorsHeaderName('Origin'), origin)
  Object.entries(CORS_BASE_OPTION).forEach(([key, value]) => response.headers.set(key, value))
  return response
}

function checkOrigin(request: NextRequest) {
  const origin = getHeader(request, 'origin')!
  const devMatches = DEV_ORIGINS.map((url) => matchUrl(origin, url))
  const isDevOrigin = devMatches.some((value) => value)
  const isDevMode = process.env.ENV === 'development'
  const isBaseOrigin = matchUrl(origin, BASE_ORIGIN)
  const isAllowedOrigin = isBaseOrigin || (isDevMode && isDevOrigin)
  return { isAllowedOrigin, isPreflight: request.method === 'OPTIONS', origin }
}

function makeCorsHeaderName(postfix: string) {
  return CORS_PREFIX + postfix
}

function getHeader(request: NextRequest, name: keyof TIncomingHeaders) {
  return request.headers.get(name)
}
