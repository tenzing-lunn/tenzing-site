/** What /api/draft returns: the last seven days of public pushes, or nothing. */
export type Draft =
  | {
      pushes: number;
      /** Commits counted from push payloads. GitHub's public events API no longer
       *  reports them, so this is often 0 even when there were pushes. */
      commits: number;
      /** "owner/name", in the order GitHub lists them (newest first). */
      repos: string[];
    }
  | { none: true };
