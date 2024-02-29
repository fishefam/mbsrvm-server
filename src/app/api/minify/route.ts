import { NextRequest } from 'next/server'

export async function POST(_: NextRequest) {
  return Response.json({ ok: 'o' })
}
