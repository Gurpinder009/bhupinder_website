
"use client";

import { useEffect, useState } from "react";
import HeroVideo from "../components/shared/HeroVideo";
import IntroBlock from "./IntroBlock";
import Memories from "./Memories";
import Services from "./Services";
import TileRow, { type Tile } from "./TileRow";
import VideoModal from "./VideoModel";
import SplashScreen from "./SplashScreen";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

// Thin gold hairline between sections
function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-gold/40 to-transparent"
    />
  );
}

export default function HomePage() {
  const [activeTile, setActiveTile] = useState<Tile | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  return (
    <>

        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

      <Header />

      <main className="relative isolate flow-root">

        {/* Fixed background video */}
        <HeroVideo src="https://media.istockphoto.com/id/1429905988/video/happy-friends-dance-together-at-wedding-fun-people-dancing-at-night-disco-party-and-marriage.mp4?s=mp4-640x640-is&k=20&c=8-ZllHrurp824glTrgGGyue8qekiWu6VsvWno4FhAxI=" />

        {/* Main page */}
        <div className="relative z-10 mt-[100svh] min-h-svh">
          <div className="bg-background">
            <Divider />
            <TileRow onOpen={setActiveTile} />
          </div>

          <div className="bg-background-darker">
            <Divider />
            <Services />
          </div>

          <div className="bg-background">
            <Divider />
            <Memories />
          </div>
        </div>

        {activeTile && (
          <VideoModal
            tile={activeTile}
            onClose={() => setActiveTile(null)}
          />
        )}

      <Footer />
      </main>
    </>
  );
}
