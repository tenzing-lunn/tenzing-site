/** The sessionStorage flag that says the loader has played. */
export const INTRO_KEY = "lunnxiv:intro";

/**
 * Runs in <head> before paint. It marks <html> `no-intro` when the loader
 * shouldn't show: already played this session, motion turned down, or the URL
 * points somewhere specific (a #hash, or a ?cite= link from select-to-cite).
 * The CSS then hides the loader, so it never flashes.
 */
export const INTRO_BOOT = `try{if(sessionStorage.getItem("${INTRO_KEY}")||location.hash||/[?&]cite=/.test(location.search)||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){document.documentElement.classList.add("no-intro")}`;
