# DESIGN.md: lunnXiv

The site is a record in an archive. A visitor lands on what looks like an arXiv abstract page, and the subject of the paper is Tenzing Lunn. Projects are submissions, experience is the submission history, the résumé is the PDF and the NeurIPS paper is the lead entry. It should feel like doing research on a person: dense, precise, quietly funny, and easy to scan.

It is better than arXiv in four ways. The reading column is capped, the type is set deliberately, it has dark mode, and the tools actually work (cite, graph, ask, keyboard). It stays as plain as arXiv: no cards, no shadows, no gradients, and **no colour at all**. The site is strictly monochrome.

> Research basis: four parallel studies of arxiv.org/abs, the arXiv listing, search and home pages, the arXiv HTML paper view, and modern reinterpretations (OpenReview, Semantic Scholar, Connected Papers, alphaXiv, Distill, gwern.net, Tufte CSS). Findings are folded in below. Values marked *(arXiv)* are measured from the live site.

---

## 1. Principles

1. **Ink on paper.** Every pixel is black, white or a neutral grey. There is no hue anywhere, in either theme. Meaning that other sites give to colour is carried by **line style**, the way printed figures do it: solid, dashed or dotted, at 1px.
2. **Metadata is the decoration.** Bracketed datelines, version strings, category codes and "Cite as" lines carry the personality, so ornament is unnecessary.
3. **Honest like a paper.** Every claim has a source. Status says exactly where things are ("Under review", not "Accepted"). The paper's limitations stay in.
4. **Fast to scan.** A recruiter gets name, affiliation, the paper and the résumé PDF in the first viewport. A curious reader can go deeper through versions, the graph and Ask.
5. **One playful thing at a time.** The drummers, the conga easter egg and the "Report an issue with this person" link are the jokes. Everything else is straight.

---

## 2. Naming and grammar

| Concept | arXiv original | lunnXiv |
|---|---|---|
| Site | arXiv | **lunnXiv** (wordmark; working name, can be swapped) |
| Person record | `arXiv:1706.03762v7` | `TL:2610.00001v4` |
| Project | submission | submission `TL:YYMM.NNNNN`, where YYMM is the start month |
| Life events | submission history `[v1]…[v7]` | `[v1]` UWC Dilijan → `[v2]` Fordham → `[v3]` Algoverse → `[v4]` NeurIPS submission (this version) |
| Category | `cs.LG`, `math.PR` | real codes for real work (`cs.LG`, `cs.AI`, `q-fin.CP`, `cs.SE`) and a `life.*` namespace for everything else (`life.MED`, `life.MUS`, `life.ART`, `life.FLM`) |
| PDF | View PDF | **View résumé (PDF)** |
| HTML (experimental) | HTML view | the long-form "about" read as a paper with a TOC |
| TeX Source | source | GitHub |
| Export BibTeX | modal | **Cite this person**: BibTeX / APA / plain text, with a copy button |
| arXivLabs tabs | Bibliographic tools… | **Tools**: Ask · Graph · Now · Shortcuts |

**ID assignments** (start month → ID):

| ID | Submission | Status |
|---|---|---|
| `TL:2512.00001` | The Network | concluded |
| `TL:2604.00002` | Nuverum CRM | live |
| `TL:2605.00003` | Correct the Note, Not the Weights *(NeurIPS 2026 workshop submission)* | under review |
| `TL:2608.00004` | Meditate With Me | live |
| `TL:2609.00005` | Compute Futures | in progress |
| `TL:2610.00001` | **the person record itself** | v4 |

**Microcopy rules**
- Datelines use arXiv's exact shape: `[Submitted Aug 2023 (v1), last revised 16 Oct 2026 (this version, v4)]`. Use month precision unless the exact date is known: never invent a day.
- The primary subject is bold: `**Machine Learning (cs.LG)**; Mathematics (math); Computational Finance (q-fin.CP)`
- Cite-as has two lines: `TL:2610.00001 [cs.LG]` then `(or TL:2610.00001v4 [cs.LG] for this version)`
- Navigation uses plain-text separators: `< prev | next >`, `new | recent | 2026`
- `(what is this?)` micro-links explain the jokes. Use at most two per page.

---

## 3. Colour

All colours are CSS custom properties on `:root`, redefined for dark mode via `prefers-color-scheme` plus a manual `I` toggle (`.force-dark` / `.force-light`), as the site does now.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#ffffff` | `#0c0c0c` | page background |
| `--ink` | `#0c0c0c` | `#f2f2f2` | titles, body text, masthead band (light) |
| `--ink-2` | `#3b3b3b` | `#c8c8c8` | abstract and prose |
| `--ink-3` | `#6f6f6f` | `#8f8f8f` | labels, datelines, metadata |
| `--rule` | `#e4e4e4` | `#252525` | hairlines and table rules |
| `--rule-strong` | `#c8c8c8` | `#3a3a3a` | sidebar left rules, inputs |
| `--wash` | `#f6f6f6` | `#141414` | the one allowed tint: code blocks and the BibTeX textarea |


**Monochrome rules**
- No hue, ever. All tokens are neutral greys between `--paper` and `--ink`.
- Status is encoded by **line style**, and every badge also carries its word:
  - **Solid** 1px outline: live / shipped
  - **Dashed** 1px outline: in progress, under review
  - **Dotted** 1px outline: concluded / archived
- Emphasis comes from weight (600), from inversion (ink fill with paper text, used only for the masthead and the active key in the Shortcuts list), or from an underline. It never comes from colour.
- Search hits and selections get a 1px ink underline, offset 3px.
- The masthead band is ink with paper text in **both** modes. In dark mode it reads as a band only because of its bottom rules.

---

## 4. Typography

| Role | Family | Notes |
|---|---|---|
| Titles, abstract, prose | **Source Serif 4** (Google Fonts, variable, opsz) | carries the "paper" feel; arXiv itself has gone sans, so serif reads as *more* paper than arXiv |
| UI chrome (nav, tabs, buttons, sidebar) | **IBM Plex Sans** | arXiv's own 2026 header face |
| IDs, versions, labels, badges, code | **IBM Plex Mono** | every identifier is mono, which is the clearest "cooler than arXiv" signal |

Load with `next/font/google` (`Source_Serif_4`, `IBM_Plex_Sans`, `IBM_Plex_Mono`), replacing Inter and JetBrains Mono.

**Scale** (px; fixed steps to fix arXiv's em-on-em drift, such as 11.7px labels):

| Token | Size / line-height | Family / weight | Use |
|---|---|---|---|
| `--t-hero` | `clamp(30px, 3.6vw, 40px)` / 1.1, tracking −0.015em | Serif 600 | the person-record title ("Tenzing Lunn") |
| `--t-title` | 28 / 1.2 | Serif 600 | submission titles on abs pages |
| `--t-h2` | 17 / 1.4 | Sans 600 | section heads ("Submission history") |
| `--t-body` | 17 / 1.65 | Serif 400 | abstract, prose |
| `--t-list` | 18 / 1.35 | Serif 600 | listing titles |
| `--t-ui` | 14 / 1.45 | Sans 400/500 | sidebar, nav, tabs |
| `--t-meta` | 13 / 1.5 | Mono 400 | metatable values, IDs |
| `--t-label` | 11 / 1.4, uppercase, tracking 0.06em | Mono 500 | labels, badges, keyboard hints |
| `--t-dateline` | 14 / 1.4 | Serif italic | bracketed datelines |

Old-style numerals in prose (`font-variant-numeric: oldstyle-nums`). Tabular numerals in tables and IDs.

---

## 5. Layout

- **Container:** `max-width: 1120px`, gutters 16px on mobile, 24px at ≥640px and 40px at ≥1024px.
- **Abs pages:** a CSS grid `minmax(0, 1fr) 272px` with a 56px gap. The main column caps prose at **68ch**. The sidebar is sticky at `top: 72px`. Below 900px the sidebar drops under the abstract as a plain stack (no grey panel, no pills).
- **Listing pages:** a single column at 760px max, with the date navigation inline at the top.
- **Indents:** following arXiv, the abstract block is indented 32px from the title edge on desktop and 0 on mobile.
- **Vertical rhythm:** a 4px base. Common gaps are 8 / 12 / 20 / 32 / 56.
- **Rules:** 1px `--rule` between sections. Sidebar blocks keep arXiv's thick-left-rule identity, done as a 1px `--rule-strong` left border with 16px padding (thinner, more modern).

---

## 6. Components

### 6.1 Masthead
- A 44px ink band. On the left are the **lunnXiv** wordmark (Serif 600, with the *X* in italic) and a mono breadcrumb: `lunnXiv > person > TL:2610.00001`.
- In the centre is a search field, `Search lunnXiv…  ⌘K`. It opens the existing command palette.
- On the right are Listings · Paper · Résumé · Ask, in Plex Sans 13/500 with `--ink-3`-on-ink text that turns to paper on hover.
- Under the band is a **1px `--rule-strong` line** across the full width.
- The subject bar is a 32px strip with a bottom `--rule`, reading `Mathematics > Machine Learning` in mono 12. It has no grey fill.

### 6.2 Record header (top of an abs page)
The order is: dateline → title → affiliation line → access links (mobile only) → Abstract → metatable.
- **Affiliation line:** Sans 15, `Fordham University · B.S. Mathematics & Computer Science · New York, NY`. Each part links to its listing.
- **Abstract:** labelled `Abstract:` in small caps (kept visible, unlike arXiv). Serif 17/1.65 in `--ink-2`, at most 68ch.
- **Metatable:** a two-column grid with mono labels (`--t-label`) on the left at 112px and values on the right. The rows are Comments, Subjects, Cite as, Contact, Live data.

### 6.3 Sidebar blocks (`.side`)
Each block has a 1px left rule, an H3 in Sans 14/600, and a list in Sans 14.
1. **Access record:** View résumé (PDF) · HTML (experimental) · Source (GitHub) · `view license`
2. **Current browse context:** `cs.LG`, then `< prev | next >`, then `new | recent | 2026`
3. **Cite this person:** an outlined button that opens the BibTeX modal
4. **References & links:** GitHub · LinkedIn · Email
5. **Live data:** the Spotify "Listening" widget with its equalizer bars, in ink

### 6.4 Listing entry
```
[3]  TL:2605.00003  [pdf, html, code]                 ┌─────────────┐
                                                      │UNDER REVIEW │  ← 1px dashed outline
     Correct the Note, Not the Weights: Runtime       └─────────────┘
     Mitigation of Emergent Misalignment in a Clinical LLM Agent
     Authors: T. Lunn, + 3 co-authors (Algoverse AI Research)
     Comments: Submitted to GenAI4Health @ NeurIPS 2026. 14 pages.
     Subjects: Machine Learning (cs.LG); Artificial Intelligence (cs.AI)
     TL;DR: Corrective retrieval cut judged-harmful answers 63.4% → 15.1%.   ▽ More
```
- The index `[n]` and the ID are mono 13. The ID underlines in ink on hover, drawing in from the left. The title is Serif 18/600.
- `▽ More` / `△ Less` expands the abstract in place. The animation is height only, 200ms.
- Entries are separated by 20px of space, with no rules (as on arXiv).
- The listing header keeps arXiv's honest counts: `Total of 10 entries`, `New submissions (showing 5 of 5 entries)`, `Showing up to 25 entries per page: fewer | more | all`. Unavailable options are plain grey text, not links.
- Search hits get a 1px ink underline, in place of arXiv's green-on-green highlight.

### 6.5 Status badge
Mono 11 uppercase, padding 2px 6px, `border: 1px <style> var(--ink)`, text in `--ink`, no fill and no radius (square corners, like a stamp).
`LIVE` (solid) · `IN PROGRESS` (dashed) · `UNDER REVIEW` (dashed) · `CONCLUDED` (dotted).

### 6.6 Submission history
Mono 13, one line per version. The current version is bold and not linked:
```
[v1] Aug 2023  UWC Dilijan, Armenia: IB Diploma 39/45, Davis Scholar
[v2] Aug 2025  Fordham University: Math & CS, full scholarship
[v3] May 2026  Algoverse AI Research: emergent misalignment
[v4] Sep 2026  NeurIPS 2026 workshop submission (this version)
```

### 6.7 Tools tabs (arXivLabs, reworked)
These are folder tabs along a 1px top rule. The active tab has a 1px ink outline on three sides and joins the panel. The panels are:
- **Ask:** the existing AI Q&A, restyled as `Query this record` with a mono input. Answers render as `Response:` blocks with cited IDs.
- **Graph:** the projects as a Connected Papers–style graph. Nodes are hairline ink circles sized by depth of involvement, with edges labelled `builds on` / `same methods`. Hovering a node thickens its outline to 2px and draws its edges in ink. The nodes use the badge line styles.
- **Now:** building / reading / listening.
- **Shortcuts:** the `?` overlay, inline.

Toggles: a 28×14 switch with a 1px outline track. Off is a hollow knob on the left; on is a filled ink knob on the right.

### 6.8 Cite modal
A native `<dialog>` with tabs for BibTeX, APA and Plain. It shows a `--wash` mono textarea and a `Copy` button that flips to `Copied ✓`.
```bibtex
@misc{lunn2026,
  title  = {Tenzing Lunn},
  author = {Lunn, Tenzing},
  year   = {2026},
  note   = {TL:2610.00001v4 [cs.LG]. Mathematics & CS, Fordham University},
  url    = {https://tenzinglunn.vercel.app}
}
```

### 6.9 Hover citations
Inline markers like `[3]` in prose open a 320px card on hover or focus. The card shows the ID, title, a one-line TL;DR and the status badge. It has a 1px ink border and no shadow.

### 6.10 Tables (booktabs)
There are no vertical rules and no cell borders: just a 1.5px top rule, a 0.75px mid rule and a 1.5px bottom rule. Captions read `Table 1: …` with the label in Sans 600 and the caption in Serif. This is used for the paper's results and the résumé.

### 6.11 Links
Links are `--ink` with a 1px underline in `--rule-strong`, offset 3px. On hover the underline turns `--ink`. They are visible without hover, so they are not hover-only like arXiv.

---

## 7. Pages

| Route | Shape | Content |
|---|---|---|
| `/` | **abs page** for `TL:2610.00001v4` | bio as the abstract, metatable, sidebar, then "Selected submissions" (the listing of five), then submission history, then the Tools tabs |
| `/list` | **listing page** | "Submissions by T. Lunn: 5 entries", plus "Cross-lists" for the résumé-only items (LXIVNY, Tennis Prediction Engine, AI Command Center) and "Replacements" as a playful home for retired projects |
| `/abs/[id]` | **abs page** per project | replaces `/projects/[slug]`; overview = Abstract, why/how/learned = sections, links = Access |
| `/abs/TL:2605.00003` | **the NeurIPS paper** | real title and abstract from the submitted PDF, results table, my contribution as a margin note, `UNDER REVIEW` badge (see §9) |
| `/html/resume` | **HTML (experimental)** reading view | the résumé as a paper with a numbered TOC rail; "View PDF" prints it |
| `/ask` | Tools → Ask, full page | |
| `/now`, `/about`, `/art` | fold into the home sidebar, Tools → Now, and a `life.*` listing | |

Keyboard shortcuts stay and are extended: `j`/`k` move to the next/previous entry, `c` opens Cite, `g` opens Graph, `/` focuses search, `I` toggles lights, `?` shows help, and typing `conga` pops up the band.

---

## 8. Motion

### 8.1 Loader: "Compiling the record"
The four Junkanoo drummers stay. They are drawn by `src/lib/band.ts` exactly as now, but **smaller and framed as a compile step**:
- The canvas is **`min(168px, 44vw)`** wide, about half the current 340px, centred and sitting just above the visual middle.
- Under it are three mono 12px log lines that appear on the beat (0.6s, 1.3s, 2.0s):
  ```
  fetching TL:2610.00001v4 …          ok
  resolving 5 submissions …           ok
  typesetting abstract …              ok
  ```
  Each `ok` gets a 1px ink underline.
- Below the log is a 120px-wide, 1px progress line in ink that fills left to right over 2.7s. 
- In the bottom corner, in mono 11 `--ink-3`, is `press any key`.
- Exit: the loader fades out and the masthead's bottom rule draws in from left to right (400ms). This replaces the full-page slide-up.
- It plays once per session, is skipped with reduced motion and is dismissed by any key or click, all as now.

### 8.2 Page transitions
The full-screen ink curtain is replaced by arXiv-appropriate restraint: a **1px ink line** that runs across under the masthead while the route loads. The old curtain is too theatrical for a document.

### 8.3 Micro-motion
- `▽ More` uses a height transition (200ms, `cubic-bezier(.2,.8,.2,1)`).
- Hover citations fade in over 120ms with a 4px rise.
- The ID underline draws from the left on hover in 300ms (the existing `.sweep`, at 1px).
- Reduced motion turns all of this off.

### 8.4 Removed
The custom difference-blend cursor fights the document feel, and the letter-by-letter name rise is too showy for a record, so both go. The conga easter egg stays, at a 200px canvas.

---

## 9. The NeurIPS paper: content rules

- **Source:** `~/Downloads/neurips2026_jdvt_final.pdf` (14 pp, built 3 Sep 2026). Title: *Correct the Note, Not the Weights: Runtime Mitigation of Emergent Misalignment in a Clinical LLM Agent*.
  - ⚠ A later file (`… (1).pdf`, 5 Sep) is titled *Runtime Mitigation of Weight-Induced Misalignment through Corrective Retrieval for Clinical LLM Agents*. **Confirm which title was submitted.**
- **Status:** `UNDER REVIEW: GenAI4Health @ NeurIPS 2026`. Nothing on the machine shows an acceptance, so it is never shown as accepted.
- **Double-blind:** the PDF is anonymized for review. Until decisions are out, **don't host the PDF.** The Access block says `PDF: withheld during double-blind review (what is this?)`, which is itself a nice research-culture detail. Link the code repo only if the workshop's anonymity policy allows it.
- **Authors:** the PDF lists none. Show `T. Lunn + 3 co-authors (Algoverse AI Research)` until the full author list and order are confirmed. Never infer them.
- **What to show:**
  - the abstract (verbatim from the PDF)
  - the content warning, as a note with a 1px solid ink left rule
  - Table 1 of headline numbers: 63.4% → 15.1% harmful; −48.3 pp [−53.3, −42.7]; 76.3% of gap recovered; 0 / 10,800 benign refusals
  - "My contribution": framework design, implementation, dataset organization, revision passes
  - "Limitations, stated plainly": retrieval did not beat the fixed prompt; single judge, single seed

---

## 10. Accessibility and quality bar
- Text contrast is ≥ 7:1 for body text and ≥ 4.5:1 for `--ink-3`. Rules that carry meaning (badge outlines) use `--ink`, so they are well above 3:1.
- Status is never conveyed by line style alone: every badge carries its word.
- Focus states are a 1px ink outline offset by 3px, visible on every interactive element.
- No horizontal scroll at 360px. Mobile keeps the order title → access links → abstract → submissions.
- Print (`Save as PDF`) keeps the current black-on-white print stylesheet for the résumé.
