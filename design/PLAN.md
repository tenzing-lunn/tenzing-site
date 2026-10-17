# PLAN.md: building lunnXiv

This plan turns DESIGN.md into the live site and adds eleven features on top. The build agents follow it, and the verification agents check their work against it.

## Order: layout first, then features

The layout goes first. Every feature hangs off something the layout defines:
- the record data model (IDs, versions, statuses)
- the abs page and the listing entries
- the sidebar
- the Tools tabs
- the keyboard registry

If features were built on the current layout, each one would have to be rebuilt when the layout changed. So there are two waves:

- **Wave A (Foundation):** one builder, because the layout touches nearly every file. It also creates an empty **stub** for every feature, already mounted in the right place. Two verifiers then check it and a fix loop runs. Nothing else starts until Wave A builds cleanly.
- **Wave B (Features):** eleven builders in parallel. Each one may edit **only the files it owns** (see the ownership table), so no two agents ever touch the same file. Each builder is followed by its own verifier, then a fix loop (at most two rounds).
- **Integration:** an orchestrator audit and a full build, then browser testing by the main session. Anything that fails goes back into the loop.

## Rules every agent follows

1. **Next.js 16 is not the Next.js you know.** Read the relevant guide in `node_modules/next/dist/docs/` before writing route handlers, metadata, `params`, redirects or fonts.
2. **No invented facts.** All prose comes from `src/content/*`, from the paper PDF text in `design/paper-abstract.txt`, or from git history. Where a fact is missing, show an honest empty state. Never invent co-author names, dates, quotes, numbers or acceptance status.
3. **Strictly monochrome.** No hue anywhere: use only the tokens in DESIGN.md §3. Status is shown by line style (solid / dashed / dotted) plus a word.
4. **Stay in your lane.** Wave B agents edit only their owned paths. If you need a change outside them, put it in your report under `needs_from_foundation` and do not make it.
5. **Do not run `next build` or `next dev` in Wave B.** Parallel builds collide on `.next`. Use `npx tsc --noEmit -p .` and `npx eslint <your files>`, and judge only errors in your own files.
6. **Keep the user's uncommitted edits.** The working tree already removes `trade-bot` from `answers.ts`, `projects.ts` and `resume.ts`. Never restore it.
7. **No commits, no pushes, no new dependencies** unless the plan names them.
8. **Reduced motion and keyboard access** apply to everything interactive.

---

## Wave A: Foundation (end goal)

When this wave is done, the site *is* lunnXiv, matching DESIGN.md and the approved mockup (`design/mockups/index.html`). Every feature has a stub that renders `null` or a minimal placeholder in its final position.

### A1. Design system
- `src/app/globals.css`: replace the tokens with the DESIGN.md §3 monochrome set, in light and dark. Keep the `I` toggle (`.force-dark` / `.force-light`).
- Remove the custom cursor, the curtain and the name-rise styles.
- Add the shared classes: `.badge` with `.b-live` / `.b-prog` / `.b-rev` / `.b-done`, the `.side` block, listing `.entry`, booktabs `table.bk`, `.dateline`, `.meta`, and the tabs.
- Fonts in `src/app/layout.tsx`: Source Serif 4, IBM Plex Sans and IBM Plex Mono via `next/font/google`, replacing Inter and JetBrains Mono.

### A2. Data model: `src/content/records.ts` (new)
- A typed `Record` has:
  - `id` (`"2605.00003"`; displayed as `TL:2605.00003`)
  - `slug` (the existing project slug, where there is one)
  - `title`
  - `status`: `live | prog | rev | done`
  - `subjects`: the primary subject first
  - `authorsLine`, `comments`, `tldr`, `formats`
  - `kind`: `submission | crosslist`
  - `href`
- Build it **from** `projects.ts` and `resume.ts`, so the prose is never duplicated. The IDs and statuses follow DESIGN.md §2. Cross-lists:
  - LXIVNY
  - AI Command Center
  - Tennis Prediction Engine
  - Mindfulness and Meditation Club
  - Art with Kindergarten Kids
  - Undated items use `26xx`.
- `person` record: `TL:2610.00001`, current version `4`, `versions[]` (v1 Aug 2023 UWC Dilijan, v2 Aug 2025 Fordham, v3 May 2026 Algoverse, v4 Sep 2026 NeurIPS submission), subjects, comments and cite lines.
- `src/content/paper.ts` (new):
  - The title is the 3 Sep PDF's title, *Correct the Note, Not the Weights: Runtime Mitigation of Emergent Misalignment in a Clinical LLM Agent*. Add a `// TODO: confirm submitted title` comment.
  - The abstract comes verbatim from `design/paper-abstract.txt`.
  - Include the content warning, the Table 1 numbers (as in the mockup), the contribution list, the limitations, and `status: "rev"`, `venue: "GenAI4Health @ NeurIPS 2026"`, `authorsLine: "Tenzing Lunn and 3 co-authors"`, `pdf: null` (withheld for double-blind review).

### A3. Chrome
- `header.tsx` becomes the masthead:
  - an ink band with the **lunnXiv** wordmark, a mono breadcrumb from the route, a search trigger that opens the existing palette, and nav links (Listings · Paper · Résumé · Ask)
  - a 1px rule beneath
  - a 32px subject bar, set per page
  - remove the curtain transition and add a 1px ink route-progress line instead
- `footer.tsx` becomes an arXiv-style footer: links separated by ` · ` (About · Now · Art · Ask · GitHub · LinkedIn · Email · RSS).
- Remove `cursor.tsx` from the layout. Keep the file so the git history stays readable, but mount nothing.

### A4. Pages
- `/` is the abs page for the person: dateline, name (`--t-hero`, 30–40px), affiliation line, abstract (bio with hover citations `[n]`), metatable, sidebar, "Selected submissions" (the five, using `<Entry>`), the **submission history slot**, then Tools tabs (Ask · Graph · Now · Shortcuts).
- `/list` is the listing:
  - an h1, then jump links: New submissions · Cross-lists · Replacements
  - the counts line, e.g. `Total of 10 entries`
  - the three sections with `(showing N of N entries)`
  - Replacements is empty, with an honest line
- `/abs/[id]` gives one abs page per record, generated from `records.ts`:
  - for projects: overview = Abstract; why / how / learned / notes = sections; Access = links
  - `2605.00003` renders the **paper page** from `paper.ts` (sidebar: "PDF: withheld during double-blind review")
  - cross-lists with no project page render a short abs page from their résumé entry
- Redirects in `next.config.ts`:
  - `/projects` → `/list`
  - `/projects/:slug` → `/abs/:id`, built from `records.ts`
  - keep `/notes` → `/thoughts`
- `/resume`, `/about`, `/now`, `/art`, `/thoughts`, `/ask`: keep them working and restyle them with the new tokens. `/resume` keeps Save as PDF and the print stylesheet.
- `not-found.tsx`: arXiv-style "Article identifier not recognized".
- `lib/index.ts` (palette index): point it at the new routes and records.

### A5. Shared components (new, in `src/components/`)
- `entry.tsx`: a listing entry exactly as in the mockup (index, ID, formats, badge, title, Authors / Comments / Subjects lines, TL;DR, ▽ More).
- `badge.tsx`, `side-block.tsx`, `metatable.tsx`, `dateline.tsx`, `tabs.tsx` (accessible tablist).
- `cite-modal.tsx`: native `<dialog>` with BibTeX / APA / Plain tabs and Copy. Opened by `c` or the sidebar button. Works for the person and for each record.
- `hover-cite.tsx`: an inline `[n]` that shows a card on hover or focus.

### A6. Motion
- `intro.tsx`: canvas width `min(168px, 44vw)` and three mono log lines (fetching / resolving / typesetting, each ending `ok`). Add a 120px ink progress line and fade out. It plays once per session; reduced motion skips it.
- `conga.tsx`: a 200px canvas. `band.ts` stays unchanged.

### A7. Keyboard registry and feature seams (the parallel-safety contract)
- `src/lib/shortcuts.ts` (new):
  - `useShortcut(key, handler, opts?)`, which ignores typing targets, plus a `SHORTCUTS` table listing every key below.
  - `ui-provider.tsx` keeps palette / shortcuts / lights and moves its route keys into the table.
  - The shortcuts overlay renders from `SHORTCUTS`.
- `src/features/<name>/index.tsx`: one stub per feature, with the **exact export names** below, each already mounted. A stub renders `null`, except `SubmissionHistory` (a plain list), `GraphPanel` (the text "Graph") and `SubscribeBlock` (a link to `/feed.xml`).
- Mark DOM for TL;DR mode: long-form blocks get `data-detail`, and one-line summaries get `data-summary`.
- Add `alternates.types['application/rss+xml'] = '/feed.xml'` to the layout metadata.

| Feature | Stub export(s) | Mounted at | Keys reserved |
|---|---|---|---|
| version-diff | `SubmissionHistory({ current })` | home, below the submissions | `v` |
| search | (none, edits the palette) | | `/`, `⌘K` |
| ask-cite | (none, edits Ask) | | |
| cite-selection | `SelectionCite()` | layout, global | (on selection) |
| view-source | `ViewSource()` | layout, global, plus a sidebar link "Source (TeX)" | `\` |
| tldr | `TldrToggle()` | sidebar of `/` and `/list`, and the masthead on mobile | `t` |
| errata | `ErrataLink()` | sidebar of `/` and every `/abs/*` | |
| endorsements | `Endorsements()` | home, after the submission history | |
| draft | `WorkingDraft()` | home, as the last line of the submission history block | |
| rss | `SubscribeBlock()` | sidebar of `/` and `/list` | |
| graph | `GraphPanel()` | home Tools tab "Graph" | `g` |
| (foundation) | | | `j`/`k` next/prev entry, `c` cite, `I` lights, `?` help |

**Wave A acceptance**
- `next build` passes and `eslint` has no errors.
- Every route above returns 200, and the old project URLs redirect.
- Pages match the mockup's structure and DESIGN.md tokens, and nothing in `src/` uses a hue.
- All stubs exist, with the exact names above, and are mounted.
- No regressions:
  - Ask still answers.
  - The Spotify widget still renders.
  - Save as PDF works.
  - `I`, `?` and ⌘K work.
  - Typing `conga` works.

---

## Wave B: Features (end goal and acceptance for each)

### B1. Version diff ("compare v3 ↔ v4")
**Goal:** your history becomes something people can explore. Every `[vN]` in the submission history is a link. `/v/[n]` shows the person record *as of* that version: its abstract, affiliation and the submissions that existed by then. A "compare" link opens `/diff?from=3&to=4`, a tracked-changes view: deletions struck through, insertions underlined, word-level, all in ink.
**Owns:**
- `src/features/version-diff/**`
- `src/app/v/**`
- `src/app/diff/**`
- `src/content/snapshots.ts`

**Data:**
- Each snapshot (affiliation, abstract and submission IDs per version) is written **only** from facts in `resume.ts`, `projects.ts` and `about.ts`, using what was true at that date. v4 equals the live record.
- Write a word-diff in plain TypeScript: an LCS over words. No new dependency.

**Accept:**
- v1–v4 all render.
- The diff of v3→v4 shows the NeurIPS addition.
- Every snapshot claim is traceable to a content file.
- `v` opens the diff from the previous version.

### B2. arXiv search operators
**Goal:** the ⌘K palette understands `ti:`, `cat:`, `status:`, `year:`, `id:` and `au:` (plus free text, and `AND` implied). Matches are underlined in ink. A one-line syntax hint sits in the footer.
**Owns:**
- `src/components/command-palette.tsx`
- `src/lib/fuzzy.ts`
- `src/lib/query.ts` (new)
- `src/lib/index.ts`

**Accept:**
- `cat:cs.SE` returns Nuverum, Meditate With Me and LXIVNY.
- `status:rev` returns the paper.
- `year:2025` returns Fordham / The Network as appropriate.
- Bad syntax degrades to plain fuzzy search.
- Unit-style checks run with `npx tsx` (or plain `node` against a compiled snippet) on `query.ts`.

### B3. Ask, with citations
**Goal:** answers cite record IDs, such as `[TL:2605.00003]`, rendered as hover-cite cards that link to the abs page. The response block is styled "Response:" with a 1px ink rule.
**Owns:**
- `src/app/api/ask/**`
- `src/lib/ask.ts`
- `src/components/ask-form.tsx`
- `src/content/persona.ts`
- `src/content/answers.ts`
- `src/app/ask/page.tsx`

**Data:**
- The system prompt includes the record IDs and instructs the model to cite them.
- The keyword fallback answers get IDs appended where they map to a record.

**Accept:**
- The fallback path, with no API key, returns cited answers.
- Citations render as hover cards.
- No invented IDs: unknown citations render as plain text.

### B4. Select to cite
**Goal:** select any sentence on any page and a small `cite` button appears near the selection. Clicking it copies the following, and the button confirms "Copied ✓":
```
"<quote>" (Lunn, 2026, TL:2610.00001v4) <url>#:~:text=<encoded>
```

**Owns:**
- `src/features/cite-selection/**`

**Accept:**
- Works on prose, not inside inputs or the palette.
- The copied URL scrolls to and highlights the quote when opened.
- `Esc` dismisses.
- Keyboard users get the same action through `c` while text is selected.
- Coordinate this with `c` = cite modal: selection wins when present. Implement it by checking the selection *inside* your handler, registered via `useShortcut` with priority.

### B5. View source
**Goal:** pressing `\`, or "Source (TeX)" in the sidebar, flips the current page into its LaTeX source in an overlay, generated from content, not hand-written. For example:
```
\documentclass{article}
\title{Tenzing Lunn}
\begin{abstract}…
\section*{Submissions} \item …
```
It has a Copy button and `\` / `Esc` to return.

**Owns:**
- `src/features/view-source/**`
- `src/lib/tex.ts` (new)

**Accept:**
- Works on `/`, `/list` and `/abs/*`.
- LaTeX special characters are escaped, so the output would compile.
- The output is monochrome, mono-set and scrollable.

### B6. TL;DR (recruiter) mode
**Goal:** one toggle (`t`, or the sidebar switch) hides every `[data-detail]` and shows `[data-summary]`, so the whole record fits on about one screen. The state persists in `localStorage` (wrapped in try/catch).

**Owns:**
- `src/features/tldr/**`, including its own CSS file

**Accept:**
- The home page in TL;DR mode fits within 1.3 viewport heights at 1280×800.
- The toggle has an accessible state.
- There is no layout shift on load: apply the class before paint, through an inline script or the layout's existing pattern. If that needs a layout change, request it via `needs_from_foundation`.

### B7. Errata
**Goal:** a public corrections log at `/errata`, styled as an arXiv errata list, with an "Errata (N)" link in the sidebars.

**Owns:**
- `src/content/errata.ts`
- `src/app/errata/**`
- `src/features/errata/**`

**Data (only real corrections):**
- The corrected claims in `projects.ts` for Compute Futures.
- Content corrections in git history (`git log --oneline -- src/content`). Include only commits that correct or remove a claim, with their date.

**Accept:**
- Every entry cites its source: a commit hash or a content file.
- Zero invented items.

### B8. Endorsements
**Goal:** an OpenReview-style "Endorsements" section with Summary, Relationship and Date for each entry, sourced from `src/content/endorsements.ts`.

**Owns:**
- `src/content/endorsements.ts` (empty array, with a typed example in a comment)
- `src/features/endorsements/**`

**Accept:**
- The empty state is one muted line, "No endorsements yet. (what is this?)", linking to an explanation.
- With a sample entry added temporarily during verification, it renders correctly. Remove the sample afterwards.
- No fabricated quotes.

### B9. Live working draft
**Goal:** a last line under the submission history, e.g. `[v5] draft · 3 changes this week`, with a link. It comes from public GitHub activity for `tenzing-lunn` and is hidden when there is none.

**Owns:**
- `src/app/api/draft/**`
- `src/features/draft/**`

**Data:** the GitHub public events API, with no token. Cache it with route revalidation of about one hour. Timeouts and rate limits fail silently, rendering nothing.

**Accept:**
- Works with the network off: it renders nothing and logs no errors.
- No secrets are needed.
- The line shows only counts and repo names, never commit messages from private repos. The public events API only returns public ones anyway.

### B10. Subscribe (RSS)
**Goal:** "Subscribe to this author" in the sidebar links to `/feed.xml`, a valid RSS 2.0 feed of the records (newest first), with a one-line "(what is this?)" explaining feed readers.

**Owns:**
- `src/app/feed.xml/**`
- `src/features/subscribe/**`

**Accept:**
- The feed passes XML well-formedness, served as `application/rss+xml`.
- Items have title, link, guid (the record ID), pubDate and description (the TL;DR).

### B11. Graph
**Goal:** a Connected Papers-style SVG in the Tools tab:
- the person in the centre
- records as nodes, with line style by status
- edges labelled by primary subject
- records that share a subject linked with a faint edge
- hover or focus thickens a node and its edges; click opens the abs page
- `g` opens the tab

**Owns:**
- `src/features/graph/**`

**Accept:**
- Deterministic layout, with no random numbers, so SSR and the client match.
- Keyboard focusable nodes.
- Works in both themes.
- No dependency added.

---

## Verification

Each Wave B builder is followed by a verifier with a different lens. It checks:
1. Does the result meet the feature's **Goal** and **Accept** list, item by item?
2. Did the builder stay within its **Owns** paths? (`git status --porcelain` filtered to files changed since the wave started, compared against the ownership table.)
3. Do `tsc` and `eslint` pass for the builder's files?
4. Is there any invented content or any hue?

A failed verdict sends the verifier's issue list back to a fixer (the same feature lane) for up to two rounds.

After Wave B, the orchestrator runs:
- an **ownership audit** across all lanes, looking for overlaps
- `npx next build`
- `eslint .`
- a **completeness critic** comparing the result with this plan

Then the main session does a browser pass over every route in both themes and at 375px and 1280px, and screenshots the proof.

---

## Revisions after review (these override anything above)

An independent reviewer read the plan, the code and the Next 16 docs. Each fix below is now binding.

### Routing and Next.js 16
- **R1. Canonical URLs are `/abs/<yymm.nnnnn>`**, e.g. `/abs/2605.00003`. The `TL:` prefix is display-only. Pages use `generateStaticParams` and `dynamicParams = false`, so unknown IDs reach the arXiv-style 404. `params` and `searchParams` are Promises.
- **R2. Redirects:** don't build them in `next.config.ts`, which can't resolve `@/`.
  - `src/app/projects/page.tsx` becomes `permanentRedirect('/list')`.
  - `src/app/projects/[slug]/page.tsx` becomes a `permanentRedirect()` shim using `records.ts`.
- **R3. Cross-lists aren't routable.** Their ID is shown but not linked. Their format link is `[résumé]`, which goes to `/resume#<anchor>`. Foundation adds the anchors on the résumé page.
- **R4.** `/feed.xml/route.ts` uses `export const dynamic = "force-static"` and `Content-Type: application/rss+xml; charset=utf-8`. `/diff` reads `searchParams` on the server, with no client `useSearchParams`. The route-progress line uses `useLinkStatus` or `Link onNavigate`, since there are no router events.

### Keyboard (`src/lib/shortcuts.ts`)
- **R5. Final keymap:**
  - `j` / `k`: next / previous entry
  - `c`: cite (selection-aware)
  - `g`: Graph tab
  - `v`: diff from the previous version
  - `\`: view source
  - `t`: TL;DR
  - `/` and ⌘K: palette
  - `I`: lights
  - `?`: help
  - **Drop** the old route keys `a`/`p`/`t`/`r`/`/`→ask and the section keys `1`–`4`.
- **R6. Foundation fills `SHORTCUTS` with every key and label.**
  - Lanes only call `useShortcut(key, handler, { priority })`.
  - Handlers run highest priority first. Returning `true` consumes the key.
  - B4 registers `c` at a higher priority and consumes it only when text is selected.
- **R7. The conga guard is central.** While the typed buffer is a prefix of "conga", the dispatcher defers `c` by 350ms and suppresses keys that continue the prefix (`o`, `n`, `g`, `a`). `conga` must still trigger the band, and must not open the cite modal or the graph.
- **R8. `I` toggles a root class.** It stops comparing `rgb(17,17,17)`. `viewport.themeColor` becomes `#ffffff` / `#0c0c0b`.

### Seams (all created by Foundation, with exact names)
- **R9.** `g` is owned by Foundation. It opens the Graph tab through `openTool("graph")`, which is also reachable at `#graph`. B11 only fills `GraphPanel`.
- **R10.** Add a stub `ViewSourceLink()` (sidebar) next to `ViewSource()` (global). They communicate through `window.dispatchEvent(new Event("view-source:open"))`.
- **R11. TL;DR state** is the class `tldr` on `<html>` plus the event `tldr:change`.
  - Foundation mounts `features/tldr/boot.ts` in `<head>`. It exports `TLDR_BOOT` (an inline script string; the stub is `""`).
  - Foundation adds `suppressHydrationWarning` on `<html>`.
  - Add `@media print { [data-detail] { display: revert !important } }` and `html.tldr` print safety.
- **R12.** `WorkingDraft` is mounted by Foundation as a **sibling** directly after `SubmissionHistory`, not inside it.
- **R13. Shared lists are pre-registered by Foundation.** `sitemap.ts` and `lib/index.ts` include `/list`, every `/abs/*`, `/errata`, `/v/1`–`/v/4`, `/diff` and `/feed.xml`. After Wave A, `lib/index.ts` belongs to B2.
- **R14. CSS lanes.** Each lane imports its own `src/features/<lane>/<lane>.css`, with every class prefixed `ft-<lane>-`. No lane edits `globals.css`.
- **R15. HoverCite API is frozen:** `<HoverCite id="2605.00003" n={3} />`. An unknown `id` renders plain text `[id]`.
- **R16. Intro skip.** The intro also skips when `location.hash` is non-empty or the URL has a `cite` search param. B4 appends `?cite=1` to copied links.

### Don't-break-everything
- **R17. Keep the old token names as aliases** (`--bg: var(--paper)`, `--fg: var(--ink)`, `--fg-2: var(--ink-2)`, `--fg-3: var(--ink-3)`, `--border: var(--rule)`, `--border-strong: var(--rule-strong)`, `--surface: var(--wash)`, `--surface-2: var(--wash)`). That way the 23 files using `bg-bg` and similar keep working.
- **R18. Remove the name-rise and `.fade-in` CSS together with the `ready` gating.** Content must never start hidden. Also remove `.has-cursor` and `.curtain` CSS with their components.
- **R19. Keep these exactly as they work today:**
  - the Spotify `.beats` markup and `/api/listening`
  - `/api/ask`, which answers with no key via the keyword fallback
  - the résumé print stylesheet and Save as PDF

### Type checks
- **R20.** Run `npx tsc --noEmit --incremental false -p .`, because the incremental build file would race between lanes.
- **R21.** Check `query.ts` with `node` (Node 22 strips types). Keep `query.ts` free of `@/` imports.

### Content honesty
- **R22. Errata** must exclude commit `99d277c`, a trade-bot correction (rule 6).
- **R23. Paper facts** (content warning verbatim, 14 pages, Table 1) come only from `design/paper-facts.md` and `design/paper-abstract.txt`.
- **R24. Versions:**
  - `[v1] Aug 2023 UWC Dilijan` (from the leadership dates)
  - `[v2] 2025 Fordham University` (year only; no month is recorded)
  - `[v3] May 2026 Algoverse`
  - `[v4] Sep 2026 NeurIPS submission`
  - B1 snapshots give a `source` for every field (e.g. `"resume.ts:education[0]"`) and are labelled "reconstructed from the résumé".
- **R25. RSS items have no `pubDate`** (it is optional in RSS 2.0) unless a day-precise date exists in content.
- **R26. Graph** uses uniform node sizes and subject-labelled edges only, with no "builds on" claims.

### Measurable acceptance (replaces the vague items)
- **No hue:** `rg -n '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' src`. Every colour hit must have R=G=B (the drummers inherit ink).
- **TL;DR:** at 1280×800, `document.documentElement.scrollHeight <= 1040` on `/`.
- **TeX:** `tex.ts` escapes the fixture ``& % $ # _ { } ~ ^ \``, and the output is shown.
- **Ask:** with no API key, `POST /api/ask` returns 200 and a non-empty answer.
- **Routes:** `curl` returns 200 for `/`, `/list`, `/abs/2605.00003`, every project `/abs/*`, `/resume`, `/about`, `/now`, `/art`, `/thoughts`, `/ask`, `/errata`, `/v/1`, `/diff?from=3&to=4` and `/feed.xml`. `/projects/correct-the-note` returns a 308 to `/abs/2605.00003`. `/abs/9999.99999` returns 404.
