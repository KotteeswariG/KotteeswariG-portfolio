import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { getAdminSession, loginAdmin } from "../../server-fns/auth";
import { ThemeToggle } from "../../components/ThemeToggle";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const session = await getAdminSession();
    if (session) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [
      { title: "Koti's Panel - Sign in" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await loginAdmin({ data: { username, password } });
      if (res.ok) {
        await router.invalidate();
        navigate({ to: "/admin" });
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <ThemeToggle />
      <main className="admin-login">
        <div className="login-card">
          <div className="login-logo" aria-hidden="true">
            K
          </div>
          <h1 className="login-title">Sign in</h1>
          <p className="login-subtitle">Koti's Panel</p>

          <form onSubmit={onSubmit} noValidate className="login-form">
            <label className="login-field">
              <span className="login-field-label">Username</span>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={pending}
                autoFocus
              />
            </label>
            <label className="login-field">
              <span className="login-field-label">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pending}
              />
            </label>

            {error ? (
              <div className="login-error" role="alert">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="login-submit"
              disabled={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
