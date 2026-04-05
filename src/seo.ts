export const SITE_URL = "https://kotteeswari-portfolio.pages.dev";

export const PERSON = {
  name: "Kotteeswari Ganesh",
  givenName: "Kotteeswari",
  familyName: "Ganesh",
  jobTitle: "Junior Software Engineer",
  email: "Kotteeswarieasu@gmail.com",
  telephone: "+61-493-451-162",
  city: "Brisbane",
  region: "Queensland",
  country: "AU",
  alumniOf: "Jaya Engineering College",
  image: `${SITE_URL}/img/profile.png`,
  sameAs: [
    "https://www.linkedin.com/in/KotteeswariG",
    "https://github.com/KotteeswariG",
    "https://x.com/KotteeswariG",
  ],
} as const;

export const SEO = {
  title:
    "Kotteeswari Ganesh - Junior Software Engineer Portfolio | Brisbane, Australia",
  description:
    "Kotteeswari Ganesh is a Brisbane-based Junior Software Engineer with one year of software engineering experience, skilled in Python, Flask, REST APIs, Pytest, JavaScript, HTML, CSS, Git, and responsive web development.",
  keywords: [
    "Kotteeswari Ganesh",
    "Kotteeswari Ganesh portfolio",
    "Junior Software Engineer Brisbane",
    "software engineer Brisbane",
    "backend software engineer",
    "Python developer Australia",
    "Flask developer portfolio",
    "REST API developer",
    "Pytest developer",
    "Test Driven Development developer",
    "web developer Australia",
    "HTML CSS JavaScript Python developer",
    "Jaya Engineering College",
  ].join(", "),
  ogImage: `${SITE_URL}/img/profile.png`,
  twitter: "@KotteeswariG",
  locale: "en_AU",
} as const;

export type ArticleSeoInput = {
  title: string;
  description: string;
  slug: string;
  category: { slug: string; name: string };
  subcategory: { slug: string; name: string };
  authorName: string;
  publishedAt: Date | null;
  updatedAt: Date;
  coverImage?: string | null;
};

export function articleUrl(input: {
  category: { slug: string };
  subcategory: { slug: string };
  slug: string;
}) {
  return `${SITE_URL}/articles/${input.category.slug}/${input.subcategory.slug}/${input.slug}`;
}

export function absoluteSiteUrl(value: string): string {
  return new URL(value, SITE_URL).toString();
}

export function articleJsonLd(a: ArticleSeoInput) {
  const url = articleUrl(a);
  const image = a.coverImage ? absoluteSiteUrl(a.coverImage) : PERSON.image;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "My Blog",
            item: `${SITE_URL}/articles`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: a.category.name,
            item: `${SITE_URL}/articles/${a.category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: a.subcategory.name,
            item: `${SITE_URL}/articles/${a.category.slug}/${a.subcategory.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: a.title,
            item: url,
          },
        ],
      },
      {
        "@type": "Article",
        headline: a.title,
        description: a.description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image,
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: a.authorName,
        },
        publisher: { "@id": `${SITE_URL}/#person` },
        datePublished: a.publishedAt
          ? new Date(a.publishedAt).toISOString()
          : new Date(a.updatedAt).toISOString(),
        dateModified: new Date(a.updatedAt).toISOString(),
        articleSection: `${a.category.name} / ${a.subcategory.name}`,
        inLanguage: "en",
      },
    ],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        givenName: PERSON.givenName,
        familyName: PERSON.familyName,
        jobTitle: PERSON.jobTitle,
        url: SITE_URL,
        image: PERSON.image,
        email: `mailto:${PERSON.email}`,
        telephone: PERSON.telephone,
        address: {
          "@type": "PostalAddress",
          addressLocality: PERSON.city,
          addressRegion: PERSON.region,
          addressCountry: PERSON.country,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: PERSON.alumniOf,
        },
        knowsAbout: [
          "HTML",
          "CSS",
          "JavaScript",
          "Python",
          "Flask",
          "REST APIs",
          "Pytest",
          "Test Driven Development",
          "Git",
          "GitHub",
          "Backend Development",
          "Responsive Web Development",
          "Data Structures and Algorithms",
        ],
        sameAs: [...PERSON.sameAs],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON.name} - Portfolio`,
        description: SEO.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SEO.title,
        description: SEO.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        primaryImageOfPage: PERSON.image,
        inLanguage: "en",
      },
    ],
  };
}
// person schema for homepage
// article schema for article pages
// og tags helper
