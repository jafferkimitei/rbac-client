import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${process.env.API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: data?.message ?? "Login failed" },
      { status: res.status }
    );
  }

  const token = data?.token;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing token" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ ok: true, user: data.user });

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
