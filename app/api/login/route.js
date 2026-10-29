import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, databaseErrorMessage } from "@/lib/db";
import { signToken } from "@/lib/auth";

const DUMMY_PASSWORD_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
const MAX_BCRYPT_BYTES = 72;

// POST /api/login — ตรวจรหัสผ่านแล้วตั้ง cookie token
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const normalizedEmail =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawPassword = typeof body.password === "string" ? body.password : "";

  if (!normalizedEmail || !rawPassword) {
    return NextResponse.json(
      { status: "error", message: "email and password are required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password, fullname FROM users WHERE email = ?",
      [normalizedEmail]
    );
    const user = rows[0];
    const withinBcryptLimit =
      Buffer.byteLength(rawPassword, "utf8") <= MAX_BCRYPT_BYTES;
    const passwordMatches = await bcrypt.compare(
      withinBcryptLimit ? rawPassword : "",
      user ? user.password : DUMMY_PASSWORD_HASH
    );

    // ใช้ข้อความเดียวกันทั้งกรณีไม่พบอีเมลและรหัสผ่านผิด
    // เพื่อไม่ให้ใช้ฟอร์มนี้ตรวจได้ว่าอีเมลใดมีในระบบ
    if (!user || !withinBcryptLimit || !passwordMatches) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    });

    const response = NextResponse.json({ status: "ok" });

    // httpOnly: JavaScript บนหน้าเว็บอ่าน cookie นี้ไม่ได้
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 ชั่วโมง เท่ากับอายุของ token
    });

    return response;
  } catch (error) {
    console.error("POST /api/login failed:", error);
    if (error?.code === "ERR_JWT_SECRET_MISSING") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Unable to log in: set JWT_SECRET in .env.local and restart the server.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: "error", message: databaseErrorMessage(error, "log in") },
      { status: 500 }
    );
  }
}
