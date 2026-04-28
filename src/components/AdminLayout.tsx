import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { logoutAdmin } from "../server-fns/auth";
import { ThemeToggle } from "./ThemeToggle";
import { ConfirmProvider } from "./ConfirmModal";

export function AdminLayout({
  username,
  children,
}: {
  username: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeTab: "articles" | "categories" | null = (() => {
    const p = pathname.replace(/\/+$/, "") || "/";
    if (p === "/admin/categories" || p.startsWith("/admin/categories/"))
      return "categories";
    if (p === "/admin" || p.startsWith("/admin/articles")) return "articles";
    return null;
  })();
  const isArticlesActive = activeTab === "articles";
  const isCategoriesActive = activeTab === "categories";

  async function handleLogout() {
    await logoutAdmin();
    navigate({ to: "/admin/login" });
  }

  function close() {
    setIsMenuOpen(false);
  }

  return (
    <ConfirmProvider>
      <div className="admin-shell">
      <header
        className={`admin-topbar${isMenuOpen ? " is-open" : ""}`}
        role="banner"
      >
        <Link
          to="/admin"
          className="admin-topbar-brand"
          onClick={close}
          aria-label="Admin home"
        >
          <img
            src="/img/profile.png"
            alt=""
            width={32}
            height={32}
            className="admin-topbar-photo"
          />
        </Link>

        <nav
          className="admin-tab-group"
          role="tablist"
          aria-label="Admin sections"
        >
          <Link
            to="/admin"
            role="tab"
            aria-selected={isArticlesActive}
            className={`admin-tab${isArticlesActive ? " active" : ""}`}
            activeProps={{}}
            inactiveProps={{}}
            onClick={close}
          >
            Articles
          </Link>
          <Link
            to="/admin/categories"
            role="tab"
            aria-selected={isCategoriesActive}
            className={`admin-tab${isCategoriesActive ? " active" : ""}`}
            activeProps={{}}
            inactiveProps={{}}
            onClick={close}
          >
            Categories
          </Link>
        </nav>

        <div className="admin-topbar-right">
          <a
            href="/"
            className="admin-topbar-link"
            target="_blank"
            rel="noopener"
            title="Open site in new tab"
          >
            Go to site
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          <span className="admin-topbar-divider" aria-hidden="true" />
          <ThemeToggle inline />
          <button
            type="button"
            className="admin-topbar-signout"
            onClick={handleLogout}
            title={`Signed in as ${username}`}
          >
            Sign out
          </button>
        </div>
        <button
          type="button"
          className="admin-topbar-mobile-toggle"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      <main className="admin-main admin-page">
        <div className="admin-container">{children}</div>
      </main>
      </div>
    </ConfirmProvider>
  );
}
// mobile topbar layout
