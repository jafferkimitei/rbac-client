"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasPermission, hasRole } from "@/lib/guards";
import "../styles/login.css";

type Me = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const rawNext = sp.get("next") || "/admin";
  const next = rawNext.startsWith("/") ? rawNext : `/${rawNext}`;

  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function canAccessNext(me: Me, path: string) {
    if (path.startsWith("/admin")) {
      if (!hasRole(me, ["admin", "super_admin"])) return false;
    }

    if (path.startsWith("/admin/users")) {
      if (!hasPermission(me, ["manage users"])) return false;
    }

    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Login failed");

      await refresh();

      const meRes = await fetch("/api/me", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const meJson = await meRes.json().catch(() => null);

      if (!meRes.ok || !meJson?.ok) {
        router.replace("/login");
        router.refresh();
        return;
      }

      const me = meJson.data as Me;
      const target = canAccessNext(me, next) ? next : "/unauthorized";

      router.replace(target);
      router.refresh();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <main className="login-container">
        <section className="login-card">
          <header className="login-header">
            <h1>Sign in</h1>
            <p>Use your credentials to access the admin platform.</p>
          </header>

          <form className="login-form" onSubmit={onSubmit}>
            <label>
              <span>Email</span>
              <input
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label>
              <span>Password</span>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {err && <p className="login-error">{err}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
