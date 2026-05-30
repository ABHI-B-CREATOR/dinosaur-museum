import ClassicPromptSection from "./ClassicPromptSection";
import React, { Suspense, useEffect, useRef, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

const DinoExperience = React.lazy(() => import("./DinoExperience.tsx"));

import modernCityTrex from "../Modern City T-Rex (Video Game City GIF by CAPCOM).gif";
import desertTheropod from "../Desert Theropod Sprint (istockphoto-2275248144).mp4";
import forestAllosaurus from "../Forest Allosaurus (3844767025-preview).mp4";
import stegosaurusMist from "../Stegosaurus in the Mist (istockphoto-2234422776).mp4";
import coastalPterosaurs from "../Coastal Pterosaurs (istockphoto-1794670031).mp4";
import lowAngleTrex from "../Low-Angle T-Rex (istockphoto-1743079504).mp4";

const heroMedia = [
  { src: modernCityTrex, kind: "image" },
  { src: desertTheropod, kind: "video" },
  { src: forestAllosaurus, kind: "video" },
  { src: stegosaurusMist, kind: "video" },
  { src: coastalPterosaurs, kind: "video" },
  { src: lowAngleTrex, kind: "video" },
];

function HeroVideo() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % heroMedia.length), 5400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Attempt to play the video element when index changes
    const el = ref.current;
    if (el) {
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, [index]);

  const item = heroMedia[index];

  return (
    <div className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden bg-black">
      {item.kind === "video" ? (
        <video
          key={item.src}
          ref={ref}
          src={item.src}
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
        />
      ) : (
        <img src={item.src} alt="hero" className="w-full h-full object-cover" />
      )}

      <div className="absolute inset-0 flex items-end">
        <div className="w-full p-6 md:p-10 lg:p-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow">Dinosaur Exhibit</h1>
          <p className="mt-2 text-white/80">A cinematic, three-dimensional museum experience.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefetch scene on mount to improve perceived load if desired (no automatic show)
  useEffect(() => {
    // no-op for now
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroVideo />

      <div className="mx-auto -translate-y-12 max-w-4xl px-6">
        {!show ? (        
          <div className="rounded-xl bg-black/60 p-6 backdrop-blur-md">
            <p className="mb-4">Experience prehistoric portals in interactive 3D.</p>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await import("./DinoExperience.tsx");
                  setShow(true);
                } catch (e) {
                  setShow(true);
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
            >
              {loading ? "Loading…" : "Enter Exhibit"}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <ErrorBoundary>
              <Suspense fallback={<div className="text-white">Loading 3D scene…</div>}>
                <DinoExperience />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}
      
      {/* Insert the classic prompt section below the hero */}
      <ClassicPromptSection />
      </div>
    </div>
  );
}
