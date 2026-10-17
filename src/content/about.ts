/**
 * About page content. The paragraphs themselves live in
 * src/components/about-text.tsx because a few words are interactive;
 * the facts they reveal live here.
 */

/** One-paragraph bio for metadata and the Ask page. */
export const bio =
  "Tenzing Lunn, a sophomore at Fordham University Lincoln Center studying math and computer science. Born and raised in Los Angeles, two years at an international boarding school in Armenia, now in New York.";

/**
 * The home page's abstract: the bio above, the résumé and the projects, told
 * the way a paper describes its subject. `[yymm.nnnnn]` marks a citation of
 * that record, rendered as a hover card.
 */
export const recordAbstract =
  "We present Tenzing Lunn, a sophomore at Fordham University studying mathematics and computer science on the 3-2 program with Columbia. Raised in Los Angeles and educated for two years at UWC Dilijan in Armenia, the subject now works in New York across three threads: AI safety research, where a study of repairing a misaligned clinical model through its memory layer was submitted to a NeurIPS 2026 workshop [2605.00003]; quantitative research on GPU-rental futures [2609.00005]; and software people use every day, including a deal-flow CRM [2604.00002] and a meditation app with synchronized group sessions [2608.00004]. Outside that, the subject paints, draws and shoots street photographs.";

/** Shown when "book" is clicked. */
export const reading = "Siddhartha by Hermann Hesse";

/** Shown when "movie" is clicked. No particular order. */
export const movies: string[] = [
  "The Cars films",
  "Fantastic Mr. Fox",
  "Isle of Dogs",
  "Howl's Moving Castle",
  "Spirited Away",
  "Ponyo",
  "The Boy and the Heron",
  "City of God",
  "The Great Beauty",
  "Limitless",
  "The Before Sunrise trilogy",
];
