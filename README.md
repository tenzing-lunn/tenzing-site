# tenzing-site

A small personal website: thoughts, projects, a current snapshot, and a place to ask questions. Text-first, keyboard-driven, no backend.

## Run

```bash
npm install
npm run dev
```

## Edit content

Everything personal lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.ts` | name, intro, location, the `/now` snapshot, external links, canonical URL |
| `about.ts` | About page facts (ethnicities, what I'm reading, top movies); the paragraphs are in `src/components/about-text.tsx` |
| `projects.ts` | project list and project page sections |
| `thoughts.ts` | thoughts (a small Markdown subset is supported) |
| `art.ts` | drawings shown on `/art` (image files go in `/public`) |

Add a project or thought by appending an object to the array. Pages, the command palette, the sitemap, and the terminal all read from these files.

## Theme

The page is light while the sun is up (07:00 to 18:00 on the visitor's clock) and dark otherwise, matching the pixel sun/moon in the footer. The hours live in `src/lib/daylight.ts`.

## Keyboard

| Key | Action |
| --- | --- |
| `A` `P` `T` | About, Projects, Thoughts |
| `/` | Ask |
| `⌘K` / `Ctrl K` | Command palette |
| `?` | Shortcut reference |
| `Esc` | Close |

The terminal at the bottom of every page understands `help`, `home`, `about`, `projects`, `thoughts`, `ask`, `now`, and `clear`.

## Deploy

```bash
vercel deploy --prod --yes
vercel alias set <deployment-url> tenzinglunn.vercel.app
```

The second line keeps the short URL pointing at the newest production deploy.

## Ask

`/api/ask` answers from `src/content/answers.ts` — a list of phrases and the reply to give when one of them appears in the question. The longest matching phrase wins, and project and thought titles are matched first. No model, no key, no network call.

Add a topic by appending an entry to that file.
