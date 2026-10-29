import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, databaseErrorMessage } from "@/lib/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_BCRYPT_BYTES = 72;

// POST /api/register — สร้างผู้ใช้ใหม่
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
  const trimmedFullname =
    typeof body.fullname === "string" ? body.fullname.trim() : "";

  if (!normalizedEmail || !rawPassword || !trimmedFullname) {
    return NextResponse.json(
      { status: "error", message: "email, password and fullname are required" },
      { status: 400 }
    );
  }

  if (normalizedEmail.length > 255 || !EMAIL_PATTERN.test(normalizedEmail)) {
    return NextResponse.json(
      { status: "error", message: "Invalid email format" },
      { status: 400 }
    );
  }

  if (trimmedFullname.length > 255) {
    return NextResponse.json(
      { status: "error", message: "Full name must not exceed 255 characters" },
      { status: 400 }
    );
  }

  if (!rawPassword.trim()) {
    return NextResponse.json(
      { status: "error", message: "Password cannot be whitespace only" },
      { status: 400 }
    );
  }

  if (rawPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      {
        status: "error",
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      },
      { status: 400 }
    );
  }

  if (Buffer.byteLength(rawPassword, "utf8") > MAX_BCRYPT_BYTES) {
    return NextResponse.json(
      { status: "error", message: "Password must not exceed 72 bytes" },
      { status: 400 }
    );
  }

  try {
    // ปฏิเสธอีเมลที่สมัครไว้แล้ว
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      normalizedEmail,
    ]);
    if (rows.length > 0) {
      return NextResponse.json(
        { status: "error", message: "Email already registered" },
        { status: 409 }
      );
    }

    // ห้ามเก็บรหัสผ่านจริง เก็บเฉพาะ bcrypt hash
    const hash = await bcrypt.hash(rawPassword, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)",
      [normalizedEmail, hash, trimmedFullname]
    );

    return NextResponse.json(
      { status: "ok", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { status: "error", message: "Email already registered" },
        { status: 409 }
      );
    }
    console.error("POST /api/register failed:", error);
    return NextResponse.json(
      { status: "error", message: databaseErrorMessage(error, "register user") },
      { status: 500 }
    );
  }
}
