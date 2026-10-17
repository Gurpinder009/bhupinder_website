"use client";

import { Suspense, useState } from "react";
import Header from "@/app/components/shared/Header";
import Footer from "@/app/components/shared/Footer";
import VideoPlayerComponent from "../components/shared/VideoPlayerComponent";

interface Story {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  year: string;
  videoUrl: string;
  aspect: string;
  description: string;
  longDescription: string;
  highlights: string[];
  metrics: string;
  tags: string[];
}

export default function HomePage() {
  return <>
    <Header />

    {/* <Suspense fallback={<div className="bg-black">loading...</div>}>

      <VideoPlayerComponent videoSrc={"/sat.mp4"} />

    </Suspense> */}

    <Footer />

  </>
}