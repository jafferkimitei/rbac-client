"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/guards";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      {hasPermission(user, ["manage users"]) && (
        <Link href="/admin">Admin</Link>
      )}
      {hasPermission(user, ["view users"]) && (
        <Link href="/admin/users">Users</Link>
      )}

      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>{user.email}</span>
            <button onClick={onLogout} disabled={loggingOut}>
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
