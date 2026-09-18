"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@/components/dialog";
import type { Piece } from "@/content/art";

const ZOOM = 2.5;

/**
 * A full-screen view of one image. Click to zoom in where you clicked, move
 * the pointer to look around, click again to zoom out. Escape or a click
 * outside the image closes it.
 */
export function Lightbox({ piece, onClose }: { piece: Piece | null; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const close = () => {
    setZoomed(false);
    onClose();
  };

  useEffect(() => {
    if (!piece) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const aim = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <Dialog open={piece !== null} onClose={close} label={piece?.title ?? "Image"} className="backdrop:bg-bg">
      {piece ? (
        <div
          className="m-auto flex max-h-full max-w-full flex-col items-center p-4 sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className={`overflow-hidden border border-border ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onPointerMove={(e) => zoomed && aim(e)}
            onClick={(e) => {
              aim(e);
              setZoomed((z) => !z);
            }}
          >
            <Image
              src={piece.src}
              alt={piece.alt}
              width={piece.width}
              height={piece.height}
              sizes="100vw"
              draggable={false}
              style={{ transform: zoomed ? `scale(${ZOOM})` : undefined, transformOrigin: origin }}
              className="block h-auto max-h-[calc(100dvh-6rem)] w-auto max-w-full select-none transition-transform duration-200 ease-out"
            />
          </div>
          <div className="mt-3 flex w-full items-baseline justify-between gap-4 font-mono text-[11px] text-fg-3">
            <span>{piece.title}</span>
            <span className="shrink-0">
              {zoomed ? "click to zoom out" : "click to zoom"} ·{" "}
              <button type="button" onClick={close} className="cursor-pointer hover:text-fg">
                close
              </button>
            </span>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
