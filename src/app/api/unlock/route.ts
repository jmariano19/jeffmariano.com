import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.PORTFOLIO_PASSWORD ?? "jeff2025";

export async function POST(req: NextRequest) {
  const { password, from } = await req.json();

  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const redirect = (from as string) || "/";
  const res = NextResponse.json({ ok: true, redirect });

  res.cookies.set("portfolio_auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
