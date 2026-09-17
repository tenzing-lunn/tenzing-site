/**
 * Time-of-day rules shared by the pixel sun/moon and the page theme.
 * The site is light while the sun is up and dark otherwise, using the
 * visitor's local clock.
 */

export type Phase = "day" | "night" | "dawn" | "dusk";
export type Theme = "light" | "dark";

export const DAY_START = 7;
export const DAY_END = 18;

export function phaseForHour(hour: number): Phase {
  if (hour >= 5 && hour < DAY_START) return "dawn";
  if (hour >= DAY_START && hour < DAY_END) return "day";
  if (hour >= DAY_END && hour < 20) return "dusk";
  return "night";
}

export function themeForHour(hour: number): Theme {
  return phaseForHour(hour) === "day" ? "light" : "dark";
}

export const THEME_COLOR: Record<Theme, string> = { light: "#fafafa", dark: "#0a0a0a" };

/** Runs before first paint so the page never flashes the wrong theme. */
export const THEME_BOOT_SCRIPT = `(function(){var h=new Date().getHours();var t=(h>=${DAY_START}&&h<${DAY_END})?"light":"dark";document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="light"?"${THEME_COLOR.light}":"${THEME_COLOR.dark}";})()`;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = THEME_COLOR[theme];
}
