"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/guards";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && user && !hasPermission(user, ["manage users"])) {
      router.replace("/unauthorized");
    }
  }, [loading, user, router]);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) return <div className="admin-loading">Loading…</div>;

  if (!user) {
    router.replace("/");
    return null;
  }

  return (
    <div className="admin-page">
      {/* Top bar */}
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-title">Admin</span>

          {hasPermission(user, ["view users", "manage users"]) && (
            <Link href="/admin/users" className="admin-link">
              Users
            </Link>
          )}
        </div>

        <div className="admin-header-right">
          <span className="admin-user">{user.email}</span>
          <button
            className="admin-logout"
            onClick={onLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>
          Access is enforced through permissions. Use the navigation above to
          manage available resources.
        </p>
      </main>
    </div>
  );
}
