"use client";

import dynamic from "next/dynamic";

// ! Adjust the path if VideoPlayerComponent lives somewhere else
const VideoPlayerComponent = dynamic(() => import("./VideoPlayerComponent"), {
  ssr: false,
  loading: () => (
    <div className="grid aspect-video place-items-center bg-ink text-sm text-white/80">Loading player...</div>
  ),
});

export default function FilmPlayer({ videoSrc, poster }: { videoSrc: string; poster: string }) {
  return (
    <div className="overflow-hidden  shadow-card">
      <VideoPlayerComponent videoSrc={videoSrc} poster={poster} />
    </div>
  );
}