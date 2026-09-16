/**
 * Central site configuration.
 *
 * Everything personal lives here (and in the sibling files in /content).
 * Replace the PLACEHOLDER values with your own — nothing in /src/app or
 * /src/components hardcodes personal facts.
 */

export const site = {
  /** Full name shown top-left and on the home page. */
  name: "Tenzing Lunn",
  /** First name used in prose ("I'm Tenzing."). */
  firstName: "Tenzing",
  /** Shown in the terminal prompt: ~/username */
  username: "tenzing",
  /** Canonical URL. Update after deploying to a custom domain. */
  url: "https://tenzing-site.vercel.app",
  /** Meta description / Open Graph description. */
  description:
    "A small personal site — notes, projects, and a place to ask questions.",

  /** PLACEHOLDER — one or two sentences for the home page. */
  intro: [
    "I'm Tenzing. I study computer science and build small tools, games, and interfaces that I want to exist.",
  ],

  /** Default location, used when the browser timezone cannot be resolved. */
  location: {
    label: "New York",
    short: "NYC",
  },

  /** Current snapshot — the /now page. Keep this honest and short. */
  now: {
    location: "New York",
    workingOn: "This website, and a small iOS side project.",
    thinkingAbout: "Interfaces that reward curiosity without demanding attention.",
    reading: "Mostly essays. A few technical books, slowly.",
    learning: "Swift, and how to write less.",
    lastUpdated: "2026-09-16",
  },

  /** External links surfaced in the command palette and on the About page. */
  links: [
    // PLACEHOLDER — point these at your real profiles.
    { label: "GitHub", href: "https://github.com/", external: true },
    { label: "Email", href: "mailto:hello@example.com", external: true },
  ],
} as const;

export type SiteLink = (typeof site.links)[number];
