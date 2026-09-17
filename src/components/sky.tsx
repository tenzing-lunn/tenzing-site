"use client";

import { useEffect, useState } from "react";
import { phaseForHour, type Phase } from "@/lib/daylight";

/**
 * A 9×9 pixel sun or moon that follows the visitor's local hour.
 * Greyscale only. Two frames alternate once a second for a faint flicker
 * (rays for the sun, a star for the moon). Honors prefers-reduced-motion.
 */

// Glyphs: "#" bright, "+" mid, "-" dim, "." empty.
const SUN_A = [
  "....+....",
  ".+.....+.",
  "..-...-..",
  "...###...",
  "+..###..+",
  "...###...",
  "..-...-..",
  ".+.....+.",
  "....+....",
];
const SUN_B = [
  "....-....",
  ".-.....-.",
  "..+...+..",
  "...###...",
  "-..###..-",
  "...###...",
  "..+...+..",
  ".-.....-.",
  "....-....",
];
const MOON_A = [
  "...###...",
  "..##...-.",
  ".##......",
  ".##......",
  ".##......",
  ".##......",
  "..##.....",
  "...###...",
  ".........",
];
const MOON_B = [
  "...###...",
  "..##.....",
  ".##....-.",
  ".##......",
  ".##......",
  ".##......",
  "..##.....",
  "...###...",
  ".........",
];
const HORIZON_A = [
  ".........",
  "....+....",
  ".+.....+.",
  "...###...",
  "..#####..",
  "---------",
  ".........",
  ".........",
  ".........",
];
const HORIZON_B = [
  ".........",
  "....-....",
  ".-.....-.",
  "...###...",
  "..#####..",
  "---------",
  ".........",
  ".........",
  ".........",
];

const FRAMES: Record<Phase, [string[], string[]]> = {
  day: [SUN_A, SUN_B],
  night: [MOON_A, MOON_B],
  dawn: [HORIZON_A, HORIZON_B],
  dusk: [HORIZON_A, HORIZON_B],
};

const SHADE: Record<string, string> = {
  "#": "var(--fg-2)",
  "+": "var(--fg-3)",
  "-": "var(--border-strong)",
};

export function Sky({ hour }: { hour: number }) {
  const phase = phaseForHour(hour);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 2), 1000);
    return () => window.clearInterval(id);
  }, []);

  const rows = FRAMES[phase][frame];

  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      role="img"
      aria-label={phase}
      className="inline-block align-[-1px]"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          SHADE[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={SHADE[ch]} /> : null,
        ),
      )}
    </svg>
  );
}
