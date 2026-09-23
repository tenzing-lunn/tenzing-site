/**
 * Central site configuration.
 *
 * Everything personal lives here (and in the sibling files in /content).
 * Nothing in /src/app or /src/components hardcodes personal facts.
 */

export const site = {
  /** Full name shown top-left and on the home page. */
  name: "Tenzing Lunn",
  /** First name used in prose ("I'm Tenzing."). */
  firstName: "Tenzing",
  /** Shown in the terminal prompt: ~/username */
  username: "tenzing",
  /** Canonical URL. Update when moving to a custom domain. */
  url: "https://tenzinglunn.vercel.app",
  /** Meta description / Open Graph description. */
  description:
    "Tenzing Lunn. Math and computer science at Fordham. Thoughts, projects, and a place to ask questions.",

  /** One or two sentences for the home page. */
  intro: [
    "I'm Tenzing. I study math and computer science at Fordham, and I like learning things across philosophy, religion, biology, and AI.",
  ],

  /** Default location, used when the browser timezone cannot be resolved. */
  location: {
    label: "New York",
    short: "NYC",
  },

  /** Current snapshot — the /now page. Keep this honest and short. */
  now: {
    location: "Manhattan, New York",
    workingOn: "A meditation web app with synchronized group sessions. Nuverum CRM and this site alongside it.",
    thinkingAbout: "AI, and what makes it interesting.",
    reading: "Siddhartha by Hermann Hesse.",
    learning: "Math and computer science, sophomore year at Fordham Lincoln Center.",
    lastUpdated: "2026-09-17",
  },

  /** External links surfaced in the command palette and on the About page. */
  links: [
    { label: "GitHub", href: "https://github.com/tenzing-lunn", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tenzing-lunn-b9411b37a/", external: true },
    { label: "Email", href: "mailto:tenzinglunn@gmail.com", external: true },
  ],
};

export type SiteLink = (typeof site.links)[number];
