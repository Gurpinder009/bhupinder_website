"use client";

import "@videojs/react/video/skin.css";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import { HlsJsVideo } from "@videojs/react/media/hlsjs-video";

// ============================================================
// * COMPONENT: VideoPlayerComponent
// * One player for both formats:
// *   .mp4 (or other normal video files) -> <Video />
// *   .m3u8 (HLS streams)                -> <HlsJsVideo />
// ============================================================

export default function VideoPlayerComponent({
  videoSrc,
  poster,
}: {
  videoSrc: string;
  poster?: string; // ? shown inside the player before playback starts
}) {
  const isHls = videoSrc.includes(".m3u8");

  return (
    <VideoPlayer poster={poster}>
      <VideoSkin style={{ width: "100%", aspectRatio: "16 / 9" }}>
        {isHls ? <HlsJsVideo src={videoSrc} playsInline /> : <Video src={videoSrc} playsInline />}
      </VideoSkin>
    </VideoPlayer>
  );
}