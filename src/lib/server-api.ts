import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL!;
if (!API_BASE_URL) throw new Error("Missing API_BASE_URL");

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      payload?.message ?? payload?.error ?? `Request failed (${res.status})`;
    const err = new Error(message) as Error & {
      status?: number;
      payload?: unknown;
    };
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload as T;
}
