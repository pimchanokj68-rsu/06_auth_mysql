import { NextResponse } from "next/server";

// POST /api/logout — ลบ cookie token
export async function POST() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
