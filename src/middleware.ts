import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("portfolio_auth");

  if (auth?.value === "true") {
    return NextResponse.next();
  }

  const redirectUrl = new URL("/unlock", request.url);
  redirectUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/case-studies/:path+"],
};
