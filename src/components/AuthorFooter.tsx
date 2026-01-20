import { Link } from "@tanstack/react-router";
import { PERSON } from "../seo";

export function AuthorFooter() {
  return (
    <aside className="author-footer">
      <img
        className="author-footer-avatar"
        src="/img/profile.png"
        alt={PERSON.name}
        width={56}
        height={56}
      />
      <div className="author-footer-body">
        <div className="author-footer-name">{PERSON.name}</div>
        <p className="author-footer-bio">
          IT graduate from {PERSON.alumniOf}. Writing about web development,
          Python and software engineering.
        </p>
        <ul className="author-footer-links" aria-label="Social profiles">
          {PERSON.sameAs.map((url) => {
            const label = url.includes("linkedin")
              ? "LinkedIn"
              : url.includes("github")
                ? "GitHub"
                : url.includes("x.com") || url.includes("twitter")
                  ? "X"
                  : "Profile";
            return (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener me">
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <Link to="/articles" className="author-footer-back">
        ← All posts
      </Link>
    </aside>
  );
}
