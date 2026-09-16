const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format an ISO date (YYYY-MM-DD) without touching the Date constructor,
 * so server and client always agree and no timezone shifting occurs.
 *
 * "short" → "Sep 13"      "long" → "Sep 13, 2026"
 */
export function formatDate(iso: string, style: "short" | "long" = "long"): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = MONTHS[(m ?? 1) - 1] ?? "";
  const day = String(d ?? 1);
  return style === "short" ? `${month} ${day}` : `${month} ${day}, ${y}`;
}
