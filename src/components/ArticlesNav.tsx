import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import type { CategoryWithSubs } from "../server-fns/categories";

const BLOG_LABEL = "My Blog";

export function ArticlesNav({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryWithSubs[];
  activeCategorySlug?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAllActive =
    location.pathname === "/articles" || location.pathname === "/articles/";

  function close() {
    setIsOpen(false);
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
      id="sideNav"
      aria-label="Blog"
    >
      <Link to="/" className="navbar-brand" onClick={close}>
        <span className="d-block d-lg-none">
          <img
            className="img-fluid rounded-circle mobile-profile-img"
            src="/img/profile.png"
            alt="Kotteeswari Ganesh"
            width={40}
            height={40}
          />
        </span>
        <span className="d-none d-lg-block">
          <img
            className="img-fluid img-profile rounded-circle mx-auto mb-2"
            src="/img/profile.png"
            alt="Kotteeswari Ganesh"
            width={160}
            height={160}
          />
          <span className="blog-sidenav-title">{BLOG_LABEL}</span>
        </span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        aria-controls="navbarSupportedContent"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`collapse navbar-collapse${isOpen ? " show" : ""}`}
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              to="/articles"
              className={`nav-link${isAllActive ? " active" : ""}`}
              aria-current={isAllActive ? "true" : undefined}
              onClick={close}
            >
              All Posts
            </Link>
          </li>
          {categories.map((c) => {
            const isActive = activeCategorySlug === c.slug;
            return (
              <li className="nav-item" key={c.id}>
                <Link
                  to="/articles/$category"
                  params={{ category: c.slug }}
                  className={`nav-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={close}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link to="/" className="sidenav-cta" onClick={close}>
          <span className="sidenav-cta-arrow" aria-hidden="true">←</span>
          <span className="sidenav-cta-label">Portfolio</span>
        </Link>
      </div>
    </nav>
  );
}
// fix link active state
