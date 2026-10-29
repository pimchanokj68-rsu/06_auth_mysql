import Link from "next/link";

// ข้อมูลนักศึกษาที่แสดงในหน้าแรก
const student = {
  firstName: "PIMCHANOK",
  lastName: "JAROONKOSONSAWAT",
  studentId: "6805795",
};

// หน้าแรก: ข้อมูลนักศึกษาและลิงก์ไปยังทุกหน้าในโปรเจกต์
export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <span className="badge">DIT205 · Next.js + MySQL + TiDB Cloud</span>
        <h1>
          Auth <span>Demo</span>
        </h1>
        <p className="lead">
          ระบบสมัครสมาชิก เข้าสู่ระบบ และหน้าสำหรับสมาชิก เข้ารหัสผ่านด้วย bcrypt
          เก็บ JWT ใน httpOnly cookie และ deploy บน Vercel
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn">
            Register
          </Link>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      </section>

      <aside className="card student-card">
        <p className="eyebrow">Student</p>
        <h2>ข้อมูลนักศึกษา</h2>
        <dl className="student-info">
          <div>
            <dt>ชื่อ (First name)</dt>
            <dd>{student.firstName}</dd>
          </div>
          <div>
            <dt>นามสกุล (Last name)</dt>
            <dd>{student.lastName}</dd>
          </div>
          <div>
            <dt>รหัสนักศึกษา (Student ID)</dt>
            <dd>{student.studentId}</dd>
          </div>
        </dl>
      </aside>

      <section className="feature-grid">
        <Link href="/register" className="card feature">
          <div className="feature-icon">📝</div>
          <h3>Register</h3>
          <p>สมัครสมาชิกด้วยชื่อ อีเมล และรหัสผ่าน</p>
        </Link>
        <Link href="/login" className="card feature">
          <div className="feature-icon">🔐</div>
          <h3>Login</h3>
          <p>เข้าสู่ระบบ รับ token ผ่าน httpOnly cookie</p>
        </Link>
        <Link href="/dashboard" prefetch={false} className="card feature">
          <div className="feature-icon">👤</div>
          <h3>Dashboard (members only)</h3>
          <p>หน้าสำหรับสมาชิก ป้องกันด้วย proxy.js</p>
        </Link>
      </section>
    </div>
  );
}
