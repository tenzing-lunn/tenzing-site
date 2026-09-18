/**
 * Drawings and photographs, newest first. The /art page shows both, and the
 * About text opens the first of each in a lightbox. Put the image file in
 * /public and give its pixel size so the page doesn't shift while loading.
 */

export type Piece = {
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

export const drawings: Piece[] = [
  {
    src: "/drawing.jpg",
    title: "Three boys",
    alt: "Pen and ink drawing of three boys in heavy coats, cross-hatched, one holding a pistol.",
    width: 2000,
    height: 1169,
    medium: "Pen and ink",
  },
];

export const photos: Piece[] = [
  {
    src: "/photo.jpg",
    title: "Two dogs",
    alt: "Black and white photograph, looking up at a stone wall: a bearded man in a hat smoking between two large hounds, a woman peeking in at the lower left.",
    width: 2000,
    height: 1500,
    medium: "Photograph",
  },
];
