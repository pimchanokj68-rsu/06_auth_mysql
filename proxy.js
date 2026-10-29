import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// ทำงานก่อนทุก request ที่ตรงกับ config.matcher
export async function proxy(request) {
  const user = await verifyToken(request.cookies.get("token")?.value);

  if (!user) {
    // ยังไม่ Login หรือ token หมดอายุ: ส่งไปหน้า login
    const redirectResponse = NextResponse.redirect(
      new URL("/login", request.url)
    );
    redirectResponse.headers.set("Cache-Control", "private, no-store");
    return redirectResponse;
  }

  const response = NextResponse.next(); // token ถูกต้อง: ไปยังหน้าที่ขอได้ตามปกติ
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

// ให้ proxy ทำงานเฉพาะพื้นที่สมาชิก
export const config = {
  matcher: ["/dashboard/:path*"],
};
