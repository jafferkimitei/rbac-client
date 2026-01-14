/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { requireAuthz } from "@/lib/authz";
import { apiFetch } from "@/lib/server-api";
import "../../styles/users.css";

type ApiUser = {
  id?: number;
  name?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
};

function normalizeUsers(payload: any): ApiUser[] {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.users)
    ? payload.users
    : Array.isArray(payload?.data?.data)
    ? payload.data.data
    : [];

  if (raw.length > 0 && typeof raw[0] === "string") {
    return raw.map((s: string, i: number) => ({
      id: i + 1,
      name: s,
      email: "",
      roles: [],
      permissions: [],
    }));
  }

  return raw;
}

function uniq(arr: string[] | undefined) {
  return Array.from(new Set((arr ?? []).filter(Boolean)));
}

export default async function UsersPage() {
  await requireAuthz({
    permissionsAny: ["view users", "manage users"],
    redirectTo: "/unauthorized",
  });

  let payload: any = null;
  let users: ApiUser[] = [];

  try {
    payload = await apiFetch<any>("/api/admin/users");
    users = normalizeUsers(payload);
  } catch (e: any) {
    return (
      <div className="users-page">
        <Header />
        <h1>Users</h1>
        <p className="users-error">
          Couldn’t load users. ({e?.message ?? "Request failed"})
        </p>
      </div>
    );
  }

  const showDebug = users.length === 0;

  return (
    <div className="users-page">
      <Header />

      <div className="users-title">
        <h1>Users</h1>
        <span>{users.length}</span>
      </div>

      {showDebug && (
        <div className="users-debug">
          <div className="users-debug-title">
            Debug: /api/admin/users payload
          </div>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </div>
      )}

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Permissions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => {
              const rowKey = u.id ?? u.email ?? `row-${idx}`;
              const roles = uniq(u.roles);
              const perms = uniq(u.permissions);

              return (
                <tr key={rowKey}>
                  <td>{u.id ?? idx + 1}</td>
                  <td>{u.name ?? "—"}</td>
                  <td>{u.email ?? "—"}</td>
                  <td>
                    {roles.length ? <Chips items={roles} limit={3} /> : "—"}
                  </td>
                  <td>
                    {perms.length ? <Chips items={perms} limit={4} /> : "—"}
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="users-empty">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="users-header">
      <div className="users-header-left">
        <span className="users-admin">Admin</span>
        <Link href="/admin/users">Users</Link>
      </div>
      <Link href="/admin" className="users-back">
        Back
      </Link>
    </header>
  );
}

function Chips({ items, limit = 4 }: { items: string[]; limit?: number }) {
  const shown = items.slice(0, limit);
  const remaining = items.length - shown.length;

  return (
    <div className="chips">
      {shown.map((x) => (
        <span key={x} className="chip" title={x}>
          {x}
        </span>
      ))}
      {remaining > 0 && (
        <span className="chip muted" title={items.join(", ")}>
          +{remaining}
        </span>
      )}
    </div>
  );
}
