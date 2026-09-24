/**
 * The four Junkanoo drummers in the intro: how big each one is, how he
 * leans, and his headdress. Drawn in ink by src/lib/band.ts.
 */

export type Drummer = {
  scale: number;
  lean: number;
  head: "fan" | "spikes" | "crown";
};

export const BAND: Drummer[] = [
  { scale: 1.12, lean: -0.05, head: "fan" },
  { scale: 1.0, lean: 0.04, head: "spikes" },
  { scale: 0.96, lean: -0.03, head: "crown" },
  { scale: 1.05, lean: 0.06, head: "spikes" },
];
