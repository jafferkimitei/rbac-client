# RBAC Admin Frontend

Role-based admin frontend built with **Next.js (App Router)** and **TypeScript**, designed to work with a **Laravel + Sanctum + Spatie Permissions** backend.

The app enforces authentication and authorization at **middleware, server, and UI levels**, with tokens kept **server-side only** (httpOnly cookies).

---

## Stack

- Next.js (App Router)
- TypeScript
- React Context (Auth)
- Laravel API (Sanctum + Spatie)
- PostgreSQL
- Jest
- GitHub Actions
- Vercel

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
