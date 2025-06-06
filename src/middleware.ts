import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parse } from 'cookie'

export function middleware(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parse(cookieHeader)

  const isAuthenticated = cookies['is_authenticated'] === 'true'

  let userValid = false
  try {
    const user = JSON.parse(cookies['user'] || 'null')
    userValid =
      user &&
      typeof user === 'object' &&
      'id' in user &&
      'email' in user
  } catch (e) {
    userValid = false
  }

  if (!isAuthenticated || !userValid) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/courses/watch'],
}
