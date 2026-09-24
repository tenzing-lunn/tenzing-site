import rough from "roughjs";
import { BAND, type Drummer } from "@/content/band";

/**
 * Draws the Junkanoo drummers from content/band.ts in ink with rough.js,
 * sitting at congas and rolling on them. The lines are redrawn with a new
 * seed twelve times a second so they shimmer like hand-drawn animation, and
 * take the page's current ink and paper colours, so they work on either.
 * Browser-only.
 */

const STEP = 60 / 122 / 4; // one sixteenth note at 122 bpm, in seconds

type Pt = [number, number];
type RC = ReturnType<typeof rough.canvas>;
type Options = Parameters<RC["line"]>[4];
type Pen = { rc: RC; o: Options; paper: string; fill: (gap: number, extra?: Options) => Options };

function pen(rc: RC, seed: number, ink: string, paper: string): Pen {
  const o = { seed, roughness: 1.4, bowing: 1.3, stroke: ink, strokeWidth: 1.5 };
  const fill = (gap: number, extra = {}) => ({ ...o, fill: ink, fillStyle: "hachure", hachureGap: gap, fillWeight: 0.6, hachureAngle: -41 + (seed % 7) * 6, ...extra });
  return { rc, o, paper, fill };
}

/** Costume shirt, head and headdress. `since` opens his mouth on the hit. */
function upperBody({ rc, o, paper, fill }: Pen, d: Drummer, since: number) {
  // costume shirt, then the crepe-paper fringe Junkanoo costumes are made of
  rc.polygon([[-27, -207], [27, -207], [21, -119], [-21, -119]], fill(8));
  for (let fx = -20; fx <= 20; fx += 4) rc.line(fx, -119, fx + (((fx * 7) % 5) - 2), -104 + ((fx / 4) % 2 ? 0 : 5), { ...o, strokeWidth: 1.1 });
  for (let y = -200; y < -125; y += 9) {
    const k = (y + 207) * 0.07;
    rc.line(-27 + k, y, -35 + k, y + 6, { ...o, strokeWidth: 1 });
    rc.line(27 - k, y, 35 - k, y + 6, { ...o, strokeWidth: 1 });
  }
  rc.line(0, -207, 0, -215, o);

  if (d.head === "fan") {
    rc.arc(0, -252, 170, 130, Math.PI * 1.08, Math.PI * 1.92, true, fill(7));
    for (let a = 1.12; a < 1.9; a += 0.13) rc.line(0, -252, Math.cos(a * Math.PI) * 84, -252 + Math.sin(a * Math.PI) * 64, o);
  } else if (d.head === "spikes") {
    for (let i = -4; i <= 4; i++) {
      const a = ((-90 + i * 17) * Math.PI) / 180;
      const len = i % 2 ? 50 : 68;
      const q: Pt = [Math.cos(a) * (18 + len), -240 + Math.sin(a) * (22 + len)];
      rc.line(Math.cos(a) * 18, -240 + Math.sin(a) * 22, q[0], q[1], o);
      rc.circle(q[0], q[1], 9, { ...o, fill: o?.stroke, fillStyle: "solid" });
    }
  } else {
    const pts: Pt[] = [];
    for (let i = 0; i <= 8; i++) pts.push([-30 + i * 7.5, i % 2 ? -262 : -300 + Math.abs(i - 4) * 6]);
    rc.polygon([[-30, -252], ...pts, [30, -252]], fill(4));
  }
  rc.ellipse(0, -236, 36, 42, { ...o, fill: paper, fillStyle: "solid" });
  rc.line(-9, -240, -4, -240, o);
  rc.line(4, -240, 9, -240, o);
  rc.ellipse(0, -224, 9, since < 0.12 ? 8 : 3, o); // mouth opens on the hit
}

const CONGA_TOP = -128;

/** A tall conga standing on the floor at x = 0. */
function conga({ rc, o, paper, fill }: Pen, hit: boolean) {
  rc.polygon([[-24, CONGA_TOP], [-31, -70], [-22, 0], [22, 0], [31, -70], [24, CONGA_TOP]], fill(11, { hachureAngle: 80 }));
  rc.line(-25, CONGA_TOP + 12, 25, CONGA_TOP + 12, { ...o, strokeWidth: 2 });
  rc.line(-23, -12, 23, -12, { ...o, strokeWidth: 2 });
  rc.ellipse(0, CONGA_TOP, 50, hit ? 9 : 13, { ...o, fill: paper, fillStyle: "solid" });
}

/**
 * One drummer sitting on a stool behind a conga at (x, base), rolling on it
 * with alternating hands, or the conga on its own before he sits down.
 */
function drawConguero(ctx: CanvasRenderingContext2D, pn: Pen, d: Drummer, x: number, base: number, t: number, seated: boolean) {
  const { rc, o } = pn;
  const n = t / STEP;
  const since = (n % 1) * STEP; // on a roll, a hand lands every sixteenth
  ctx.save();
  ctx.translate(x, base);
  ctx.scale(d.scale, d.scale);
  if (!seated) {
    conga(pn, false);
    ctx.restore();
    return;
  }
  const SIT = 45; // how far sitting lowers his upper body
  // stool, then legs folded in front of it
  rc.line(-22, -76, 22, -76, { ...o, strokeWidth: 2 });
  rc.line(-18, -76, -24, 0, o);
  rc.line(18, -76, 24, 0, o);
  rc.linearPath([[-14, -76], [-42, -66], [-46, 0], [-58, 2]], o);
  rc.linearPath([[14, -76], [42, -66], [46, 0], [58, 2]], o);
  ctx.save();
  ctx.translate(0, SIT + 1.5 * Math.sin(n * Math.PI * 0.5)); // a small bob with the roll
  ctx.rotate(d.lean);
  upperBody(pn, d, since);
  ctx.restore();
  conga(pn, since < 0.05);
  // two hands trading hits on the skin
  for (const side of [-1, 1]) {
    const up = Math.sin((((n + (side > 0 ? 1 : 0)) % 2) / 2) * Math.PI);
    const H: Pt = [side * (12 + up * 6), CONGA_TOP - 4 - up * 32];
    rc.linearPath([[side * 25, -200 + SIT], [side * (44 + up * 4), -134 - up * 10], H], o);
    rc.circle(H[0], H[1], 11, o);
  }
  ctx.restore();
}

/** Scale for something popping into place over 0.22s from `at`, overshooting a little. */
function pop(t: number, at: number) {
  const p = Math.min(1, Math.max(0, (t - at) / 0.22)) - 1;
  return 1 + 2.7 * p ** 3 + 1.7 * p ** 2;
}

const W = 620;
const H = 330;
const BASE = 318;
const X = [95, 238, 382, 525];

/**
 * Plays the band onto a canvas sized to its CSS width: the congas pop up one
 * after another, then a drummer sits down at each on a roll. Runs for
 * `seconds` (Infinity to keep playing). Returns a stop function.
 */
export function playBand(canvas: HTMLCanvasElement, { seconds, sitAt, popAt }: { seconds: number; sitAt: (i: number) => number; popAt: (i: number) => number }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = canvas.clientWidth / W;
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(H * scale * dpr);
  canvas.style.height = `${H * scale}px`;
  const ctx = canvas.getContext("2d");
  const rc = rough.canvas(canvas);
  const start = performance.now();
  let raf = 0;

  const draw = () => {
    if (!ctx) return;
    const t = (performance.now() - start) / 1000;
    const seed = (Math.floor(t * 12) % 3) * 10;
    const style = getComputedStyle(document.body);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    ctx.clearRect(0, 0, W, H);
    rc.line(20, BASE + 3, W - 20, BASE + 1, { seed: seed + 1, roughness: 1.6, stroke: style.color, strokeWidth: 0.6 });
    X.forEach((x, i) => {
      const seated = t >= sitAt(i);
      // congas pop from their middle, drummers spring up from the floor
      const s = seated ? pop(t, sitAt(i)) : pop(t, popAt(i));
      if (s <= 0) return;
      const cy = seated ? BASE : BASE - 64 * BAND[i].scale;
      ctx.save();
      ctx.translate(x, cy);
      ctx.scale(s, s);
      ctx.translate(-x, -cy);
      drawConguero(ctx, pen(rc, seed + i + 1, style.color, style.backgroundColor), BAND[i], x, BASE, t * 1.4, seated);
      ctx.restore();
    });
    if (t < seconds) raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}
