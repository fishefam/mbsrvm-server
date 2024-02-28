import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const cookie = request.cookies
  console.log(cookie)
  return Response.json({ ok: 'o' })
}
