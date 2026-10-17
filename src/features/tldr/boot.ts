/** The localStorage flag that remembers TL;DR mode: "1" on, "0" off. */
export const TLDR_KEY = "lunnxiv:tldr";

/**
 * Runs in <head> before paint. If the reader left TL;DR mode on, it puts
 * `tldr` on <html> so the details never flash in and collapse. Storage can
 * throw (private windows, blocked site data); then the page stays in full.
 */
export const TLDR_BOOT = `try{if(localStorage.getItem("${TLDR_KEY}")==="1")document.documentElement.classList.add("tldr")}catch(e){}`;
