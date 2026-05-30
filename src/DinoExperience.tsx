import { useEffect, useMemo, useState, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  PresentationControls,
  RoundedBox,
  Sparkles,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import { Color, Group, SRGBColorSpace } from "three";
import {
  ArrowRight,
  Bone,
  Camera,
  Compass,
  Layers3,
  MapPinned,
  Orbit,
  ScanSearch,
  Sparkles as SparklesIcon,
  Wind,
  type LucideIcon,
} from "lucide-react";

import modernCityTrex from "../Modern City T-Rex (Video Game City GIF by CAPCOM).gif";
import desertTheropod from "../Desert Theropod Sprint (istockphoto-2275248144).mp4";
import forestAllosaurus from "../Forest Allosaurus (3844767025-preview).mp4";
import stegosaurusMist from "../Stegosaurus in the Mist (istockphoto-2234422776).mp4";
import coastalPterosaurs from "../Coastal Pterosaurs (istockphoto-1794670031).mp4";
import lowAngleTrex from "../Low-Angle T-Rex (istockphoto-1743079504).mp4";

type MediaKind = "video" | "image";

type Scene = {
  title: string;
  subtitle: string;
  era: string;
  habitat: string;
  mood: string;
  media: string;
  kind: MediaKind;
  palette: string;
  fact: string;
};

type GuideCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const scenes: Scene[] = [
  {
    title: "Modern City T-Rex",
    subtitle: "Shock opener and cinematic hook",
    era: "Breakout",
    habitat: "Neo-urban chaos",
    mood: "High-energy impact",
    media: modernCityTrex,
    kind: "image",
    palette: "#d17a3c",
    fact: "Use this as the first punch: the impossible appears in a familiar world.",
  },
  {
    title: "Desert Theropod Sprint",
    subtitle: "Speed, threat, and heat shimmer",
    era: "Chase",
    habitat: "Arid basin",
    mood: "Intense motion",
    media: desertTheropod,
    kind: "video",
    palette: "#e0b15c",
    fact: "Best for a wide shot with drifting sand and hard motion energy.",
  },
  {
    title: "Forest Allosaurus",
    subtitle: "Documentary realism in a living habitat",
    era: "Discovery",
    habitat: "Pine and fern woodland",
    mood: "Natural and observed",
    media: forestAllosaurus,
    kind: "video",
    palette: "#5f7f46",
    fact: "Slow the tempo here so it feels like a field recording in the wild.",
  },
  {
    title: "Stegosaurus in the Mist",
    subtitle: "Ancient calm under atmospheric fog",
    era: "Suspense",
    habitat: "Misty swampland",
    mood: "Mysterious and heavy",
    media: stegosaurusMist,
    kind: "video",
    palette: "#7a8a79",
    fact: "Dense fog and soft lighting make this chapter feel ancient and sacred.",
  },
  {
    title: "Coastal Pterosaurs",
    subtitle: "Flight, freedom, and scale over water",
    era: "Expanse",
    habitat: "Sea cliffs and open coast",
    mood: "Majestic and uplifting",
    media: coastalPterosaurs,
    kind: "video",
    palette: "#5f93b5",
    fact: "Open the frame wide so the world suddenly feels enormous.",
  },
  {
    title: "Low-Angle T-Rex",
    subtitle: "Final apex reveal and dominant finish",
    era: "Climax",
    habitat: "Fern floor under a cloudy sky",
    mood: "Suspense and power",
    media: lowAngleTrex,
    kind: "video",
    palette: "#8b5a3b",
    fact: "End here so the experience lands like a final museum-grade roar.",
  },
];

const guideCards: GuideCard[] = [
  {
    title: "Camera Language",
    description: "Use low-angle reveals, slow dolly-ins, and deliberate camera drift instead of fast game-style motion.",
    icon: Camera,
  },
  {
    title: "Spatial Rules",
    description: "Keep foreground dust, midground portals, and distant atmosphere separate so depth reads instantly.",
    icon: Layers3,
  },
  {
    title: "Narrative Flow",
    description: "Move from modern shock to desert chase, then forest, mist, coast, and a final apex predator reveal.",
    icon: Compass,
  },
  {
    title: "Interaction",
    description: "Let the user rotate the space slightly, click chapters, and always keep the current scene centered.",
    icon: Orbit,
  },
];

const palette = [
  { name: "Bone", value: "#d8c7ab" },
  { name: "Basalt", value: "#090a0d" },
  { name: "Amber", value: "#d38a3a" },
  { name: "Moss", value: "#617e4d" },
  { name: "Sea Fog", value: "#7aa7a6" },
  { name: "Ash", value: "#72706d" },
];

function VideoSceneMedia({ src, active }: { src: string; active: boolean }) {
  const texture = useVideoTexture(src, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "anonymous",
  });

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.92}
      metalness={0.02}
      toneMapped={false}
      transparent
      opacity={active ? 1 : 0.92}
    />
  );
}

function ImageSceneMedia({ src, active }: { src: string; active: boolean }) {
  const texture = useTexture(src);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <meshStandardMaterial
      map={texture}
      roughness={0.92}
      metalness={0.02}
      toneMapped={false}
      transparent
      opacity={active ? 1 : 0.92}
    />
  );
}

function PortalCard({
  scene,
  index,
  activeScene,
  onSelect,
}: {
  scene: Scene;
  index: number;
  activeScene: number;
  onSelect: (index: number) => void;
}) {
  const group = useRef<Group>(null);
  const active = index === activeScene;
  const offset = index - activeScene;

  useFrame((_state, delta) => {
    if (!group.current) return;

    const targetX = offset * 5.8;
    const targetY = Math.sin(index * 0.85) * 0.4;
    const targetZ = -Math.abs(offset) * 2.8;

    group.current.position.x += (targetX - group.current.position.x) * delta * 4.6;
    group.current.position.y += (targetY - group.current.position.y) * delta * 4.6;
    group.current.position.z += (targetZ - group.current.position.z) * delta * 4.6;
    group.current.rotation.y += ((active ? 0 : -offset * 0.12) - group.current.rotation.y) * delta * 4.6;
    group.current.rotation.x += ((active ? 0 : -0.02) - group.current.rotation.x) * delta * 4.6;
    group.current.scale.x += ((active ? 1 : 0.8) - group.current.scale.x) * delta * 4.6;
    group.current.scale.y += ((active ? 1 : 0.8) - group.current.scale.y) * delta * 4.6;
    group.current.scale.z += ((active ? 1 : 0.8) - group.current.scale.z) * delta * 4.6;
  });

  const onClick = (_event: ThreeEvent<MouseEvent>) => {
    onSelect(index);
  };

  return (
    <group ref={group} onClick={onClick}>
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.18}>
        <RoundedBox args={[5.8, 3.6, 0.34]} radius={0.18} smoothness={6}>
          <meshStandardMaterial
            color={scene.palette}
            roughness={0.7}
            metalness={0.18}
            transparent
            opacity={active ? 0.26 : 0.15}
          />
        </RoundedBox>

        <mesh position={[0, 0, 0.19]}>
          <planeGeometry args={[5.3, 3.1]} />
          {scene.kind === "video" ? (
            <VideoSceneMedia src={scene.media} active={active} />
          ) : (
            <ImageSceneMedia src={scene.media} active={active} />
          )}
        </mesh>

        <mesh position={[0, 0, 0.21]}>
          <planeGeometry args={[5.5, 3.3]} />
          <meshBasicMaterial
            color={active ? new Color(scene.palette) : new Color("#ffffff")}
            transparent
            opacity={active ? 0.08 : 0.035}
          />
        </mesh>
      </Float>
    </group>
  );
}

function GalleryInner({
  activeScene,
  onSelectScene,
}: {
  activeScene: number;
  onSelectScene: (index: number) => void;
}) {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const targetX = (activeScene - (scenes.length - 1) / 2) * 5.8;
    camera.position.x += (targetX - camera.position.x) * 0.045;
    camera.position.y += ((pointer.y * 0.55) - camera.position.y) * 0.035;
    camera.position.z += 10.5 - camera.position.z * 0.955;
    camera.lookAt(targetX, 0, -4.5);
  });

  return (
    <>
      <color attach="background" args={["#050608"]} />
      <fog attach="fog" args={["#050608", 12, 34]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[6, 7, 5]} intensity={2.6} color="#ffd7a6" />
      <directionalLight position={[-7, -2, -4]} intensity={0.8} color="#86c9c3" />
      <pointLight position={[0, 3, 6]} intensity={1.5} color="#d38a3a" />

      <PresentationControls global rotation={[0.02, 0.18, 0]} polar={[-0.2, 0.16]} azimuth={[-0.6, 0.6]}>
        <group position={[0, 0, -1]}>
          {scenes.map((scene, index) => (
            <PortalCard key={scene.title} scene={scene} index={index} activeScene={activeScene} onSelect={onSelectScene} />
          ))}

          <Sparkles count={160} scale={16} size={3.5} speed={0.35} color="#d7b77f" />
        </group>
      </PresentationControls>

      <ContactShadows position={[0, -2.7, -3]} scale={18} blur={2.8} opacity={0.34} far={10} color="#000000" />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

function GalleryStage({
  activeScene,
  onSelectScene,
}: {
  activeScene: number;
  onSelectScene: (index: number) => void;
}) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10.5], fov: 34, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: true }} shadows className="!absolute inset-0">
      <GalleryInner activeScene={activeScene} onSelectScene={onSelectScene} />
    </Canvas>
  );
}

export default function DinoExperience() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveScene((previous) => (previous + 1) % scenes.length);
    }, 5400);

    return () => window.clearInterval(timer);
  }, []);

  const active = scenes[activeScene];

  const heroStats = useMemo(
    () => [
      { label: "Scenes", value: "06" },
      { label: "Mood", value: active.era },
      { label: "Palette", value: active.palette },
    ],
    [active]
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#050608] text-white selection:bg-[#d7b77f] selection:text-[#050608]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(211,138,58,0.16),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(95,127,70,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(122,167,166,0.12),transparent_28%),linear-gradient(180deg,#090a0d_0%,#06070a_42%,#040405_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:84px_84px]" />

      <main className="relative z-10">
        <section className="px-6 pb-10 pt-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-5">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.32em] text-white/55">
              <div className="h-2 w-2 rounded-full bg-[#d38a3a] shadow-[0_0_20px_rgba(211,138,58,0.8)]" />
              Living Fossil Theater
            </div>
            <div className="hidden items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-white/45 md:flex">
              <ScanSearch size={14} />
              WebGL 3D expedition
            </div>
          </div>

          <div className="grid gap-10 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
                <SparklesIcon size={12} />
                React 19 / Vite 6 / Tailwind 4 / R3F / Drei
              </div>

              <h1 className="max-w-4xl text-[clamp(3rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                A three-dimensional journey through the age of giants.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
                This version turns the page into a camera-driven corridor of floating specimen portals. The six uploaded clips become a staged prehistoric narrative rather than simple thumbnails.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                    <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/45">{item.label}</div>
                    <div className="mt-2 text-sm font-medium text-white/85">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/45">style guide</div>
                  <div className="mt-2 text-lg font-medium text-white">Museum-grade, cinematic, and tactile</div>
                </div>
                <MapPinned className="text-white/45" size={18} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {palette.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="h-14 rounded-xl border border-white/8" style={{ background: item.value }} />
                    <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.28em] text-white/55">{item.name}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4 text-sm leading-relaxed text-white/72">
                Keep the palette bone, amber, basalt, moss, fog, and sea-light. Use depth, shadow, slow motion, and glass-like panels so the scene feels expensive and ancient.
              </div>
            </div>
          </div>
        </section>

        <section className="px-2 pb-12 pt-4 md:px-4 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-6 flex items-center justify-between px-4 md:px-8">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.34em] text-white/45">
                  3D expedition corridor
                </div>
                <h2 className="mt-2 text-2xl font-medium text-white md:text-4xl">
                  The active dinosaur scene is centered in a real WebGL gallery.
                </h2>
              </div>
              <div className="hidden items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-white/45 md:flex">
                <Wind size={14} />
                atmospheric layers
              </div>
            </div>

            <div className="relative mx-2 h-[780px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#07080b]/70 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:mx-4 md:h-[820px]">
              <GalleryStage activeScene={activeScene} onSelectScene={setActiveScene} />

              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 md:px-8">
                <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-white/55">
                  <Orbit size={14} />
                  active scene {String(activeScene + 1).padStart(2, "0")}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/55">{active.title}</div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-white/8 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 py-4 md:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/45">current narrative</div>
                    <div className="mt-2 max-w-2xl text-lg leading-relaxed text-white/78 md:text-xl">{active.fact}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:w-[420px] pointer-events-auto">
                    {scenes.map((scene, index) => (
                      <button
                        key={scene.title}
                        type="button"
                        onClick={() => setActiveScene(index)}
                        className={`rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                          activeScene === index
                            ? "border-white/25 bg-white/10 text-white"
                            : "border-white/8 bg-white/5 text-white/55 hover:border-white/15 hover:bg-white/8"
                        }`}
                      >
                        <div className="text-[10px] font-mono uppercase tracking-[0.26em]">{String(index + 1).padStart(2, "0")}</div>
                        <div className="mt-2 text-sm font-medium leading-tight">{scene.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 pt-4 md:px-12 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/45">visual system</div>
                  <h3 className="mt-2 text-2xl font-medium text-white">How the dinosaur world should feel</h3>
                </div>
                <Bone className="text-white/45" size={18} />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {guideCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <card.icon size={18} className="text-white/55" />
                    <h4 className="mt-3 text-lg font-medium text-white">{card.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/45">scene order</div>
                  <h3 className="mt-2 text-2xl font-medium text-white">The strongest narrative flow</h3>
                </div>
                <Wind className="text-white/45" size={18} />
              </div>

              <div className="mt-5 space-y-3">
                {scenes.map((scene, index) => (
                  <button
                    key={scene.title}
                    type="button"
                    onClick={() => setActiveScene(index)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      activeScene === index
                        ? "border-white/20 bg-white/12"
                        : "border-white/8 bg-black/20 hover:border-white/15 hover:bg-white/8"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/45">chapter {String(index + 1).padStart(2, "0")}</div>
                      <div className="mt-2 text-base font-medium text-white">{scene.title}</div>
                    </div>
                    <ArrowRight size={16} className="text-white/45" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
