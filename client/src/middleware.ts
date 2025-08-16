import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  console.log("this is request", request.url);
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  // return NextResponse.redirect(new URL('/', request.url))
  return response;
}

export const config = {
  matcher: '/dashboard/:path*',
};