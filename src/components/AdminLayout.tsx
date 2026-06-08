import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { logoutAdmin } from "../server-fns/auth";
import { ThemeToggle } from "./ThemeToggle";
import { ConfirmProvider } from "./ConfirmModal";

const EDITOR_URL_RE = /^\/admin\/articles\/(new|\d+\/edit)$/;
const LAST_EDITOR_KEY = "kg-admin-last-editor";

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
  const [lastEditorUrl, setLastEditorUrl] = useState<string | null>(null);

  // Track the most recent article-editor URL so the "Articles" tab can
  // bounce the user back to where they were editing, instead of the
  // list, when they return from Categories.
  //
  // We prefer window.location.pathname over the router's pathname here
  // because the new-article page rewrites the URL via
  // history.replaceState (so the in-place auto-save can swap "/new" for
  // "/<id>/edit" without remounting). The router doesn't observe that
  // call, so its pathname can lag.
  useEffect(() => {
    const realPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    if (EDITOR_URL_RE.test(realPath)) {
      try {
        sessionStorage.setItem(LAST_EDITOR_KEY, realPath);
      } catch {
        // ignore - storage disabled
      }
      setLastEditorUrl(realPath);
    } else {
      try {
        setLastEditorUrl(sessionStorage.getItem(LAST_EDITOR_KEY));
      } catch {
        setLastEditorUrl(null);
      }
    }
  }, [pathname]);

  const activeTab: "articles" | "categories" | null = (() => {
    const p = pathname.replace(/\/+$/, "") || "/";
    if (p === "/admin/categories" || p.startsWith("/admin/categories/"))
      return "categories";
    if (p === "/admin" || p.startsWith("/admin/articles")) return "articles";
    return null;
  })();
  const isArticlesActive = activeTab === "articles";
  const isCategoriesActive = activeTab === "categories";

  // Smart Articles tab destination:
  //   - currently inside an editor → tab acts as "back to list"
  //   - elsewhere with a remembered editor URL → resume editing
  //   - otherwise → list
  const onEditorPage = EDITOR_URL_RE.test(pathname);
  const articlesHref =
    !onEditorPage && lastEditorUrl ? lastEditorUrl : "/admin";

  function clearLastEditor() {
    try {
      sessionStorage.removeItem(LAST_EDITOR_KEY);
    } catch {
      // ignore
    }
    setLastEditorUrl(null);
  }

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
            to={articlesHref}
            role="tab"
            aria-selected={isArticlesActive}
            className={`admin-tab${isArticlesActive ? " active" : ""}`}
            activeProps={{}}
            inactiveProps={{}}
            onClick={close}
            title={
              articlesHref !== "/admin"
                ? "Resume editing your draft"
                : "Browse articles"
            }
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
