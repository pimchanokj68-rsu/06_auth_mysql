import mysql from "mysql2/promise";

const parsedPort = Number(process.env.DB_PORT);
const useSsl = /^(true|1)$/i.test(process.env.DB_SSL?.trim() || "");

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3307,
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE || "dit205_db",
  // TiDB Cloud บังคับใช้ TLS ส่วน CAMPP บนเครื่องไม่ใช้ จึงเปิดตามค่า DB_SSL
  ssl: useSsl
    ? { minVersion: "TLSv1.2", rejectUnauthorized: true }
    : undefined,
  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 2,
  idleTimeout: 60000,
  enableKeepAlive: true,
};

// connection pool นำการเชื่อมต่อกลับมาใช้ซ้ำในทุก request แทนการเปิดการเชื่อมต่อใหม่ทุกครั้ง
export const pool =
  globalThis.__dit205AuthMysqlPool ?? mysql.createPool(poolConfig);

if (process.env.NODE_ENV !== "production") {
  globalThis.__dit205AuthMysqlPool = pool;
}

export function databaseErrorMessage(error, action) {
  if (
    error?.code === "ER_SECURE_TRANSPORT_REQUIRED" ||
    /insecure transport/i.test(error?.message || "")
  ) {
    return `Unable to ${action}: TiDB Cloud requires TLS. Set DB_SSL=true in environment variables.`;
  }
  if (error?.code === "ER_ACCESS_DENIED_ERROR" || /Access denied/i.test(error?.message || "")) {
    return `Unable to ${action}: Database username or password is incorrect.`;
  }
  if (error?.code === "ER_BAD_DB_ERROR" || error?.code === "ER_NO_SUCH_TABLE") {
    return `Unable to ${action}: run database.sql in SQL Editor / phpMyAdmin first.`;
  }
  if (error?.code === "ECONNREFUSED") {
    return `Unable to ${action}: start MySQL in CAMPP first (port ${poolConfig.port}).`;
  }
  return `Unable to ${action} (${error?.code || "database error"})`;
}
