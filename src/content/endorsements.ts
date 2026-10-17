/**
 * Endorsements: short notes from people Tenzing has worked with, shown on the
 * home page in the style of OpenReview comments. Each one is added by hand,
 * with the author's permission and in their own words. Never paraphrase,
 * shorten or write one on someone's behalf. Until there is a real one, the
 * list stays empty and the page says so.
 */

export type Endorsement = {
  /** The author's name, as they want it shown. */
  name: string;
  /** Their role and organization, e.g. "Research mentor, Algoverse AI Research". */
  role: string;
  /** How they know Tenzing, in a few words. */
  relationship: string;
  /** Month precision unless the exact day is known: "Sep 2026". */
  date: string;
  /** The note itself, verbatim. */
  summary: string;
  /**
   * Where the note was published, e.g. a LinkedIn recommendation. With a
   * source the note is drawn with a solid outline; without one (sent
   * privately) it is dashed.
   */
  source?: { label: string; href: string };
};

export const endorsements: Endorsement[] = [
  // {
  //   name: "<Full name>",
  //   role: "<Role>, <Organization>",
  //   relationship: "<e.g. Supervised Tenzing on the X project>",
  //   date: "<Mon YYYY>",
  //   summary: "<Their note, word for word>",
  //   source: { label: "LinkedIn recommendation", href: "<https://…>" },
  // },
];
