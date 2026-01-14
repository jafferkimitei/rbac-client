import { requireAuthz } from "@/lib/authz";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthz({
    rolesAny: ["admin", "super_admin"],
    redirectTo: "/unauthorized",
  });

  return <div className="min-h-screen">{children}</div>;
}
