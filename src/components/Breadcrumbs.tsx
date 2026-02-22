import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export type Crumb =
  | { label: string }
  | { label: string; to: "/articles" }
  | { label: string; to: "/articles/$category"; params: { category: string } }
  | {
      label: string;
      to: "/articles/$category/$subcategory";
      params: { category: string; subcategory: string };
    }
  | { label: string; to: "/" };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  // Hide on root of a section - a single-item breadcrumb just duplicates the H1.
  if (items.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="blog-breadcrumbs">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 ? <span className="sep">/</span> : null}
            {"to" in c && !isLast ? (
              "params" in c ? (
                <Link to={c.to} params={c.params}>
                  {c.label}
                </Link>
              ) : (
                <Link to={c.to}>{c.label}</Link>
              )
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{c.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
