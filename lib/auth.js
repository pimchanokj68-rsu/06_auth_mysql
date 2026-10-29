import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret || !rawSecret.trim()) {
    const error = new Error(
      "JWT_SECRET environment variable is not set in .env.local"
    );
    error.code = "ERR_JWT_SECRET_MISSING";
    throw error;
  }
  // jose ต้องการ secret ในรูปแบบ bytes ไม่ใช่ string ธรรมดา
  return new TextEncoder().encode(rawSecret);
}

// สร้าง token ที่เซ็นแล้ว หมดอายุใน 1 ชั่วโมง
export function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecret());
}

// คืน payload หาก token ถูกต้อง หากไม่ถูกต้องคืน null
export async function verifyToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      !payload ||
      (typeof payload.id !== "number" && typeof payload.id !== "string") ||
      !payload.id ||
      typeof payload.email !== "string" ||
      !payload.email.trim() ||
      typeof payload.fullname !== "string" ||
      !payload.fullname.trim()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null; // ไม่มี token, token ถูกแก้ไข หรือหมดอายุ
  }
}
