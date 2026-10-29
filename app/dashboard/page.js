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
      <div className="auth-box">
        <h1>Dashboard</h1>
        <p className="error">{errorMessage}</p>
        <button onClick={handleLogout} disabled={loggingOut}>
          Logout
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-box">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <h1>Dashboard</h1>
      <p>Welcome, {user.fullname}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} disabled={loggingOut}>
        Logout
      </button>
    </div>
  );
}
