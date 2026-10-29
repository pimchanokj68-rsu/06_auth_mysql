"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ส่งข้อมูลฟอร์มไปยัง API หากสำเร็จไปหน้า login
  const handleRegister = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok) {
        router.push("/login");
        return;
      }

      setMessage(data?.message || "Unable to register");
      setSubmitting(false);
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-box">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          value={fullname}
          onChange={(event) => setFullname(event.target.value)}
          placeholder="Full name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          minLength={6}
          required
        />
        <button type="submit" disabled={submitting}>
          Register
        </button>
      </form>
      {message && <p className="error">{message}</p>}
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
