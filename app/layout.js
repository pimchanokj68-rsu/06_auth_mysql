import Link from "next/link";
import "./style.css";

export const metadata = {
  title: "Auth Demo | PIMCHANOK JAROONKOSONSAWAT 6805795",
  description: "Authentication and protected member area with Next.js, MySQL (TiDB Cloud), bcrypt, and JWT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <header className="site-header">
          <div className="container nav">
            <Link href="/" className="brand">
              <span className="brand-mark">A</span>
              Auth Demo
            </Link>
            <nav className="nav-links">
              <Link href="/register">Register</Link>
              <Link href="/login">Login</Link>
              {/* prefetch={false}: ไม่ให้ Next.js เก็บผล redirect ของหน้าสมาชิกไว้ล่วงหน้า */}
              <Link href="/dashboard" prefetch={false} className="nav-cta">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="container page">{children}</main>

        <footer className="site-footer">
          <div className="container">
            DIT205 · PIMCHANOK JAROONKOSONSAWAT · 6805795
          </div>
        </footer>
      </body>
    </html>
  );
}
