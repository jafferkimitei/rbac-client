import Link from "next/link";
import "./styles/home.css";

export default function Home() {
  return (
    <div className="page">
      <main className="container">
        <section className="card">
          <header className="header">
            <h1>Role-Based Admin Platform</h1>
            <p>
              A secure admin system powered by <strong>Laravel + Spatie</strong>{" "}
              and a modern <strong>Next.js App Router</strong> frontend.
              Permissions and roles are enforced end-to-end.
            </p>
          </header>

          <div className="actions">
            <Link href="/login" className="btn primary">
              Sign in
            </Link>

            <Link href="/admin" className="btn secondary">
              Admin Dashboard
            </Link>
          </div>

          <footer className="note">
            Unauthorized users are automatically redirected.
          </footer>
        </section>
      </main>
    </div>
  );
}
