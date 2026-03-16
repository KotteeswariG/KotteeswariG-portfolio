import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { getAdminSession } from "../server-fns/auth";
import { AdminLayout } from "../components/AdminLayout";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const session = await getAdminSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }
    return { session };
  },
  loader: async ({ context }) => {
    const session = (context as { session?: { username: string } }).session;
    return { session: session ?? null };
  },
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminShell,
});

function AdminShell() {
  const location = useLocation();
  const { session } = Route.useLoaderData();

  if (location.pathname === "/admin/login" || !session) {
    return <Outlet />;
  }

  return (
    <AdminLayout username={session.username}>
      <Outlet />
    </AdminLayout>
  );
}
// redirect to login if not authenticated
