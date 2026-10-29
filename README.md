# 06_auth_mysql — ระบบ Login และหน้าสมาชิกด้วย Next.js และ MySQL

โปรเจกต์รายวิชา **DIT205** สร้างระบบสมัครสมาชิก (Register), เข้าสู่ระบบ (Login), พื้นที่สำหรับสมาชิก (Protected Dashboard) และออกจากระบบ (Logout) ด้วย **Next.js 16 (App Router)** เชื่อมต่อฐานข้อมูล **MySQL** บน **CAMPP** เข้ารหัสผ่านด้วย `bcryptjs` และออก **JWT** เก็บใน `httpOnly` cookie พร้อมป้องกันหน้าสมาชิกด้วย `proxy.js`

## โครงสร้างไฟล์หลัก

- `database.sql` — คำสั่ง SQL สร้างฐานข้อมูล `dit205_db` และตาราง `users`
- `.env.local` — ตั้งค่าการเชื่อมต่อ MySQL (`DB_PORT=3307`) และรหัสลับ `JWT_SECRET`
- `lib/db.js` — Connection Pool ของ `mysql2/promise`
- `lib/auth.js` — ฟังก์ชัน `signToken` และ `verifyToken` ด้วยไลบรารี `jose` (HS256, อายุ 1 ชั่วโมง)
- `proxy.js` — ตรวจ cookie `token` ก่อนเข้าหน้า `/dashboard/:path*` หากไม่ผ่านจะ redirect ไป `/login`
- `app/api/register/route.js` — `POST /api/register` ตรวจข้อมูล, เช็กอีเมลซ้ำ (`409`), สร้าง bcrypt hash และบันทึกผู้ใช้ใหม่ (`201`)
- `app/api/login/route.js` — `POST /api/login` เทียบรหัสผ่านด้วย `bcrypt.compare` และตั้ง `httpOnly` cookie ชื่อ `token`
- `app/api/me/route.js` — `GET /api/me` ตรวจ `token` แล้วคืนข้อมูลผู้ใช้ที่ Login อยู่ หรือ `401 Unauthorized`
- `app/api/logout/route.js` — `POST /api/logout` ลบ cookie `token` ออกจากเบราว์เซอร์
- `app/page.js` — หน้าแรกแสดงลิงก์ไปยัง `/register`, `/login` และ `/dashboard`
- `app/register/page.js` — ฟอร์มสมัครสมาชิก
- `app/login/page.js` — ฟอร์มเข้าสู่ระบบ
- `app/dashboard/page.js` — หน้าสำหรับสมาชิก แสดงชื่อ อีเมล และปุ่ม Logout
- `app/style.css` — สไตล์รวมของทุกหน้าในระบบสมาชิก

## วิธีรันโปรเจกต์

1. เปิดโปรแกรม **CAMPP** แล้วกด **Start** เพื่อให้ MySQL ทำงานที่พอร์ต `3307`
   - หากยังไม่มีตาราง `users` ใน `dit205_db` ให้เปิด phpMyAdmin (`http://127.0.0.1:8080/phpmyadmin/`) แล้วรันคำสั่งใน `database.sql`
2. เปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน:

```bash
cd C:\Users\lenovo\Desktop\dit205\06_auth_mysql
npm run dev
```

3. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)
