"use client";

import { useState } from "react";
import HeroVideo from "../components/shared/HeroVideo";
import ClosingCta from "./ClosingCta";
import IntroBlock from "./IntroBlock";
import Memories from "./Memories";
import Services from "./Services";
import TileRow, { type Tile } from "./TileRow";
import VideoModal from "./VideoModel";

// * Thin gold hairline between sections
function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-gold/40 to-transparent"
    />
  );
}

// * Home Page component
export default function HomePage() {
  const [activeTile, setActiveTile] = useState<Tile | null>(null);

  return (
    <main className="relative isolate flow-root">
      {/* Container 1: fixed background video */}
      <HeroVideo src="/sat.mp4" />

      {/* Container 2: scrolls up over the video */}
      <div className="relative z-10 mt-[100svh] min-h-svh surface-green">

 <div className="surface-deep">
          <Divider />
        <TileRow onOpen={setActiveTile} />
          
        </div>

        <div className="surface-green">
          <Divider />
          <Services />
        </div>

        {/* * Darker band: the tonal break in the middle of the page */}


        <div className="surface-deep">
          <Divider />
          <Memories />



        </div>


        <div className="surface-green">
          <Divider />
          <ClosingCta />




        </div>



      </div>

      {activeTile && <VideoModal tile={activeTile} onClose={() => setActiveTile(null)} />}
    </main>
  );
}