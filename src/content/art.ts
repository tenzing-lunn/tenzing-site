/**
 * Drawings shown on the /art page, newest first. Put the image file in
 * /public and give its pixel size so the page doesn't shift while loading.
 */

export type Drawing = {
  src: string;
  /** Short title, shown as the caption. */
  title: string;
  /** What the image shows, for screen readers. */
  alt: string;
  width: number;
  height: number;
  year?: number;
  medium?: string;
};

export const drawings: Drawing[] = [
  {
    src: "/drawing.jpg",
    title: "Three boys",
    alt: "Pen and ink drawing of three boys in heavy coats, cross-hatched, one holding a pistol.",
    width: 2000,
    height: 1169,
    medium: "Pen and ink",
  },
];
