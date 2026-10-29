"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // โหลดข้อมูลผู้ใช้ที่ Login อยู่จาก API
  useEffect(() => {
    let active = true;

    fetch("/api/me", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!active) return;

        if (response.status === 401) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
          return;
        }
        if (!response.ok || !data) {
          setErrorMessage(data?.message || "Unable to load profile");
          return;
        }
        setUser(data);
      })
      .catch(() => {
        if (active) {
          setErrorMessage("Unable to connect to the server.");
        }
      });

    // กลับมาหน้านี้ด้วยปุ่ม Back (bfcache) ให้โหลดใหม่เพื่อตรวจ cookie อีกครั้ง
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      active = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // ให้เซิร์ฟเวอร์ลบ cookie แล้วไปหน้า login
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      // โหลดหน้าใหม่ ล้างหน้า Dashboard ที่ cache ไว้
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  };

  if (errorMessage) {
    return (
      <div className="card auth-card">
        <h1>Dashboard</h1>
        <p className="error">{errorMessage}</p>
        <p className="auth-footer">
          <button className="btn-danger" onClick={handleLogout} disabled={loggingOut}>
            Logout
          </button>
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card auth-card">
        <p className="loading">Loading...</p>
      </div>
    );
  }

  const initial = (user.fullname || "?").trim().slice(0, 1).toUpperCase();

  return (
    <div className="card dashboard-card">
      <div className="dashboard-cover" />
      <div className="dashboard-body">
        <div className="avatar" aria-hidden="true">
          {initial}
        </div>
        <h1>Dashboard</h1>
        <p className="auth-subtitle">Welcome, {user.fullname}</p>

        <dl className="profile-list">
          <div>
            <dt>Full name</dt>
            <dd>{user.fullname}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Member ID</dt>
            <dd>#{user.id}</dd>
          </div>
        </dl>

        <button className="btn-danger" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
