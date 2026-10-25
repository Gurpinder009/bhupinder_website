// ============================================================
// * COMPONENT: VideoModal
// * Pop-up player on the native <dialog>. Esc closes it, so does clicking the dark area.
// * It is only mounted while open, so closing it stops the video.
// ============================================================

import { useEffect, useRef } from "react";
import { Tile } from "./TileRow";

export default function VideoModal({ tile, onClose }: { tile: Tile; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    // ? Guard against calling showModal twice (React StrictMode runs effects twice in dev)
    if (dialog && !dialog.open) dialog.showModal();

    // * Stop the page behind the pop-up from scrolling
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Film: ${tile.name}`}
      onClose={onClose} // ? fires on Esc as well
      className="m-0 h-full max-h-none w-full max-w-none bg-black/90 p-0 backdrop:bg-black/90"
    >
      <div
        className="relative flex h-full w-full items-center justify-center p-4 md:p-12"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <video src={tile.videoSrc} controls autoPlay playsInline className="max-h-[80svh] w-full max-w-5xl rounded-lg bg-black" />

        <button
          type="button"
          aria-label="Close video"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
