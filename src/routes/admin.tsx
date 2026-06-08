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

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  // beforeLoad redirects to /admin/login when there's no session, so this
  // branch only fires during the brief window where loader data hasn't
  // caught up with a navigation. Render nothing rather than a bare
  // <Outlet/>, which would mount the child route without ConfirmProvider
  // and crash useConfirm().
  if (!session) {
    return null;
  }

  return (
    <AdminLayout username={session.username}>
      <Outlet />
    </AdminLayout>
  );
}
