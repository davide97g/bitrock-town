import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// For the mock version, we'll simplify the middleware
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
}

