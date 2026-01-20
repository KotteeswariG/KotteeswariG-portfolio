import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "interests", label: "Interests" },
] as const;

export function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("about");
  const isBlog = location.pathname.startsWith("/articles");

  // Lock active highlight during programmatic smooth-scroll so the
  // IntersectionObserver doesn't toggle it for every section we pass through.
  const lockUntilRef = useRef(0);

  useEffect(() => {
    if (!isHome) return;
    const sectionEls = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntilRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size === 0) return;
        let bestId = "";
        let bestRatio = -1;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) {
          setActiveId((prev) => (prev === bestId ? prev : bestId));
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  const handleSectionClick =
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      setIsOpen(false);
      if (!isHome) {
        // From any non-home page, let TanStack Router navigate to /#section.
        // Default Link behavior handles the SPA navigation; the browser then
        // scrolls to the hash element.
        return;
      }
      event.preventDefault();
      const target = id === "page-top" ? null : document.getElementById(id);
      lockUntilRef.current = Date.now() + 1000;
      setActiveId(id === "page-top" ? "about" : id);
      if (id === "page-top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
      id="sideNav"
      aria-label="Primary"
    >
      <a
        className="navbar-brand"
        href="/"
        onClick={(e) => {
          if (isHome) {
            e.preventDefault();
            handleSectionClick("page-top")(e);
          } else {
            e.preventDefault();
            navigate({ to: "/" });
          }
          setIsOpen(false);
        }}
        aria-label="Kotteeswari Ganesh - home"
      >
        <span className="d-block d-lg-none">
          <img
            className="img-fluid rounded-circle mobile-profile-img"
            src="/img/profile.png"
            alt="Kotteeswari Ganesh"
            width={40}
            height={40}
            fetchPriority="high"
          />
        </span>
        <span className="d-none d-lg-block">
          <img
            className="img-fluid img-profile rounded-circle mx-auto mb-2"
            src="/img/profile.png"
            alt="Kotteeswari Ganesh"
            width={160}
            height={160}
            fetchPriority="high"
          />
        </span>
      </a>
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
          {SECTIONS.map(({ id, label }) => {
            const isActive = isHome && activeId === id;
            return (
              <li className="nav-item" key={id}>
                {isHome ? (
                  <a
                    className={`nav-link${isActive ? " active" : ""}`}
                    href={`#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={handleSectionClick(id)}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    to="/"
                    hash={id}
                    className="nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <Link
          to="/articles"
          className={`sidenav-cta${isBlog ? " active" : ""}`}
          activeProps={{ className: "sidenav-cta active" }}
          onClick={() => setIsOpen(false)}
        >
          My Blog
        </Link>
      </div>
    </nav>
  );
}
// adjust nav active link colour
// typo fix
