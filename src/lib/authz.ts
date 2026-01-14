import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/server-api";

type MeResponse = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

type GuardOptions = {
  rolesAny?: string[];
  permissionsAll?: string[];
  permissionsAny?: string[];
  redirectTo?: string;
};

export async function requireAuthz(opts: GuardOptions = {}) {
  const redirectTo = opts.redirectTo ?? "/unauthorized";

  try {
    const me = await apiFetch<MeResponse>("/api/me");

    const hasAnyRole =
      !opts.rolesAny?.length ||
      opts.rolesAny.some((r) => me.roles?.includes(r));

    const hasAllPerms =
      !opts.permissionsAll?.length ||
      opts.permissionsAll.every((p) => me.permissions?.includes(p));

    const hasAnyPerm =
      !opts.permissionsAny?.length ||
      opts.permissionsAny.some((p) => me.permissions?.includes(p));

    if (!hasAnyRole || !hasAllPerms || !hasAnyPerm) redirect(redirectTo);

    return me;
  } catch (e: unknown) {
    const error = e as Error & { status?: number };
    if (error?.status === 401)
      redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
    redirect("/login");
  }
}
