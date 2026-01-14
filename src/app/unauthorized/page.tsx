import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border p-6 shadow-sm">
        <div className="text-sm uppercase tracking-wide opacity-70">403</div>
        <h1 className="text-2xl font-semibold mt-2">Access denied</h1>
        <p className="mt-2 opacity-80">
          You’re authenticated, but your role/permissions don’t cover this
          resource.
        </p>

        <div className="mt-6 flex gap-3">
          <Link className="rounded-xl border px-4 py-2" href="/">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
