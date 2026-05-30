import { useEffect, useRef, useState, useId } from "react";
import { motion, AnimatePresence, usePresence } from "motion/react";
import {
  ArrowRight,
  Bone,
  Dna,
  Gem,
  Leaf,
  BookOpen,
  Plus,
  ArrowUpRight,
} from "lucide-react";

// --- DATA ---
const chaptersData = [
  { name: "Age of Dinosaurs", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png" },
  { name: "Fossils of Ancient Life", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png" },
  { name: "Reptiles of the Mesozoic", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png" },
  { name: "Marine Fossil Gallery", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png" },
  { name: "Prehistoric Giants", image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png" }
];

// --- ANIMATION VARIANTS ---
const fadeUp: any = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock: any = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

// --- SandTransitionImage component (self-contained) ---
const SandTransitionImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isPresent, safeToRemove] = usePresence();
  const filterId = useId();
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const offsetRef = useRef<SVGFEOffsetElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const colorRef = useRef<SVGFEColorMatrixElement | null>(null);

  useEffect(() => {
    let start = performance.now();
    let reqId = 0;
    const duration = 900;

    const animate = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);

      let effectProgress = 0;
      if (isPresent) {
        const ease = 1 - Math.pow(1 - t, 4);
        effectProgress = 1 - ease;
      } else {
        const ease = Math.pow(t, 3);
        effectProgress = ease;
      }

      if (dispRef.current) dispRef.current.scale.baseVal = effectProgress * 150;
      if (offsetRef.current) {
        const dy = isPresent ? effectProgress * -80 : effectProgress * 120;
        offsetRef.current.dy.baseVal = dy;
        offsetRef.current.dx.baseVal = (effectProgress * 60) - 30;
      }
      if (blurRef.current) blurRef.current.setStdDeviation(effectProgress * 6, effectProgress * 6);
      if (colorRef.current) {
        const opacity = Math.max(0, 1 - effectProgress * 1.2);
        try {
          // values is readonly on some DOM typings; use setAttribute to update safely
          (colorRef.current as unknown as Element).setAttribute(
            "values",
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0`
          );
        } catch (e) {
          // fallback: ignore
        }
      }

      if (t < 1) reqId = requestAnimationFrame(animate);
      else if (!isPresent && safeToRemove) safeToRemove();
    };

    reqId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId);
  }, [isPresent, safeToRemove]);

  const safeId = String(filterId).replace(/[^a-zA-Z0-9]/g, "");

  return (
    <>
      <svg className="hidden w-0 h-0 absolute" aria-hidden>
        <defs>
          <filter id={safeId} colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="disp" />
            <feOffset ref={offsetRef} dx="0" dy="0" result="offset" />
            <feGaussianBlur ref={blurRef} stdDeviation="0" result="blur" />
            <feColorMatrix ref={colorRef} type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <img src={src} alt={alt} className={className} style={{ filter: `url(#${safeId})` }} crossOrigin="anonymous" referrerPolicy="no-referrer" />
    </>
  );
};

export default function ClassicPromptSection() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const videoTimer = setTimeout(() => setShowVideo(true), 2800);
    return () => clearTimeout(videoTimer);
  }, []);

  useEffect(() => {
    const chapterInterval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % chaptersData.length);
    }, 3500);
    return () => clearInterval(chapterInterval);
  }, []);

  return (
    <div className="font-sans bg-[#fcfcfc] text-[#111] overflow-x-hidden selection:bg-black selection:text-white">
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000 ease-in-out ${showVideo ? "opacity-100" : "opacity-0"}`}>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" src="https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4" />
        </div>

        <motion.header className="pt-6 px-6 md:px-16 z-20 relative" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}>
          <motion.h1 className="w-full" variants={{ initial: { scale: 1.03 }, animate: { scale: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
            <svg viewBox="0 0 840 100" className="w-full fill-[#111]">
              <g transform="translate(0,0)">
                <motion.polygon points="0,0 14,0 14,100 0,100" variants={letterBlock} />
                <motion.polygon points="200,0 214,0 214,100 200,100" variants={letterBlock} />
                <motion.polygon points="0,0 33,0 214,100 181,100" variants={letterBlock} />
              </g>
              <g transform="translate(280,0)">
                <motion.polygon points="0,0 14,0 14,100 0,100" variants={letterBlock} />
                <motion.polygon points="200,0 214,0 214,100 200,100" variants={letterBlock} />
                <motion.polygon points="14,43 200,43 200,57 14,57" variants={letterBlock} />
              </g>
              <g transform="translate(560,0)">
                <motion.polygon points="0,0 14,0 14,100 0,100" variants={letterBlock} />
                <motion.polygon points="266,0 280,0 280,100 266,100" variants={letterBlock} />
                <motion.polygon points="0,0 26,0 153,100 127,100" variants={letterBlock} />
                <motion.polygon points="254,0 280,0 153,100 127,100" variants={letterBlock} />
              </g>
            </svg>
          </motion.h1>

          <motion.div className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase" variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}>
            <div className="w-[15%] flex flex-col">
              <span>Natura</span>
              <span>History</span>
              <span>Museum</span>
            </div>
            <div className="hidden md:block w-[5%]"><ArrowRight size={14} strokeWidth={1} className="text-gray-400" /></div>
            <div className="flex-1 md:w-[30%] text-gray-800 leading-relaxed max-w-[200px] md:max-w-none">Exploring the story of life on earth through science, discovery and wonder.</div>
            <div className="hidden md:block w-[5%]"><ArrowRight size={14} strokeWidth={1} className="text-gray-400" /></div>
            <ul className="hidden md:flex w-[15%] flex-col space-y-1">{['Visit', 'Exhibitions', 'Discover', 'Learn', 'About'].map((link) => (<li key={link}><a href="#" className="text-gray-800 hover:text-black hover:underline">{link}</a></li>))}</ul>
            <button className="z-[60] flex flex-col gap-[6px] group relative w-10 h-6 justify-center items-end outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className={`h-[1.5px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'w-8 rotate-45 translate-y-[3.75px]' : 'w-8 group-hover:w-6'}`} />
              <div className={`h-[1.5px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'w-8 -rotate-45 -translate-y-[3.75px]' : 'w-8 group-hover:w-10'}`} />
            </button>
          </motion.div>
        </motion.header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="md:hidden absolute top-[180px] left-0 w-full bg-[#fcfcfc] border-b border-gray-200 shadow-xl z-50 p-6">
              <ul className="flex flex-col space-y-6 text-sm font-mono tracking-[0.2em] uppercase">{['Visit', 'Exhibitions', 'Discover', 'Learn', 'About'].map((link) => (<li key={link}><a href="#" className="text-gray-800 hover:text-black">{link}</a></li>))}</ul>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="px-10 md:px-16 mt-20 sm:mt-28 md:mt-32 w-[320px] z-10 flex-1" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}>
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6"><span className="text-xs font-mono">01</span><div className="w-16 h-[1.5px] bg-black/20" /></motion.div>
          <motion.h2 variants={fadeUp} className="text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] mb-6">TIMELESS <br /> WONDERS</motion.h2>
          <motion.p variants={fadeUp} className="text-[13px] md:text-[14px] text-gray-700 w-[240px] leading-[1.6] mb-10">Step into the natural world and discover the stories written millions of years ago.</motion.p>
          <motion.button variants={fadeUp} className="group relative overflow-hidden bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm transition-transform duration-300 hover:-translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-sm flex items-center gap-3">
            <div className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white group-hover:fill-[#111] transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1 z-10 relative"><path d="M12,2C12,2 12,10 12,22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M12,12C12,12 18,12 18,6C18,6 12,6 12,12Z" /><path d="M12,16C12,16 6,16 6,10C6,10 12,10 12,16Z" /></svg>
            <span className="text-[15px] font-medium text-white group-hover:text-[#111] transition-colors duration-300 z-10 relative">Explore Now</span>
          </motion.button>
        </motion.div>

        <motion.div className="absolute right-10 md:right-16 top-1/2 -translate-y-1/2 w-[200px] mt-12 md:mt-20 hidden md:flex flex-col z-10" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}>
          <motion.h3 variants={fadeUp} className="text-[10px] font-bold font-mono tracking-widest uppercase mb-2">Tyrannosaurus Rex</motion.h3>
          <motion.p variants={fadeUp} className="text-[12px] text-gray-600 leading-[1.6] mb-8">Late Cretaceous period <br /> 68-66 million years ago</motion.p>
          <motion.div variants={fadeUp} className="flex gap-6 mb-8">
            <div><div className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-1">Length</div><div className="text-[13px] font-medium">12.3 m</div></div>
            <div><div className="text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-1">Height</div><div className="text-[13px] font-medium">4.0 m</div></div>
          </motion.div>
          <motion.button variants={fadeUp} className="group flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:border-black group-hover:bg-[#111]"><Plus size={16} strokeWidth={1.5} className="text-[#111] group-hover:text-white transition-colors duration-300" /></div><span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#111]">View Details</span></motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-10 left-[2.5rem] md:left-[4rem] hidden md:flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px]"><div className="w-[1px] h-[12px] bg-gray-600" /><div className="w-[1px] h-[12px] bg-gray-600" /></div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">Scroll to explore</span>
        </motion.div>
      </section>

      <section className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20 overflow-hidden">
        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12 text-center"><span className="text-gray-500 mr-2">[ 02 ]</span><span className="text-gray-900 font-bold uppercase">Explore Our World</span></div>
        <motion.h2 initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] max-w-[1000px] text-center px-6 mb-10 md:mb-16">Unearth the stories of our planet's past through fossils, minerals, and ancient wonders.</motion.h2>
        <motion.div initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }} className="flex flex-wrap justify-center gap-3 md:gap-4 px-6 mb-10 md:mb-24 max-w-3xl">{[{ icon: Bone, label: "Dinosaurs" },{ icon: Dna, label: "Ancient Life" },{ icon: Gem, label: "Minerals" },{ icon: Leaf, label: "Fossils" },{ icon: BookOpen, label: "Learn More" }].map((pill, idx) => (<motion.button key={idx} variants={fadeUp} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 hover:border-black hover:bg-black hover:text-white transition-all duration-300"><pill.icon size={14} strokeWidth={2} />{pill.label}</motion.button>))}</motion.div>
        <div className="w-full min-h-[220px] md:min-h-[450px]" />
        <div className="absolute bottom-0 w-full px-8 md:px-16 pb-8 md:pb-12 pointer-events-none flex justify-between hidden md:flex text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium z-10"><span>WE DON'T JUST TELL STORIES.</span><span>PALEONTOLOGY (C) 2026</span></div>
      </section>

      <section className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30">
        <motion.div initial={{ y: "-65%", opacity: 0 }} whileInView={{ y: "-78%", opacity: 1 }} viewport={{ margin: "100px" }} transition={{ duration: 1.4, ease: "easeOut" }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] md:w-[1100px] pointer-events-none z-0">
          <img src="https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png" alt="Pterodactyl Fossil" className="w-full h-auto object-contain" />
        </motion.div>

        <div className="px-8 md:px-16 pt-32 md:pt-48 mb-16 z-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
          <div className="max-w-4xl">
            <h2 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white">Curated from millions of years of wonder <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 translate-y-[-4px]">{[Bone, Dna, Leaf].map((Icon, i) => (<div key={i} className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors duration-300"><Icon size={22} /></div>))}</span>& discovery.</h2>
          </div>
          <div className="flex flex-col xl:items-end w-full xl:w-auto"><p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed xl:text-right">WE DON'T JUST DISPLAY FOSSILS <br /> WE SHARE EARTH'S STORY</p><div className="flex gap-3">{['Educational', 'Authentic', 'Inspiring'].map((tag) => (<div key={tag} className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 hover:bg-white hover:text-black hover:border-white transition-colors cursor-pointer">{tag}</div>))}</div></div>
        </div>

        <div className="w-full border-t border-gray-800 flex flex-col md:flex-row z-10 relative">
          <div className="w-full md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[400px] md:min-h-[500px] relative flex flex-col justify-between p-8">
            <div className="text-gray-500 text-xl tracking-[0.3em] font-mono">***</div>
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <AnimatePresence mode="wait">
                <SandTransitionImage key={activeChapter} src={chaptersData[activeChapter].image} alt={chaptersData[activeChapter].name} className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten" />
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4 mt-auto z-10"><div className="text-[10px] font-mono tracking-widest text-[#888] uppercase overflow-hidden h-4 flex items-center"><AnimatePresence mode="popLayout"><motion.span key={activeChapter} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="inline-block">0{activeChapter + 1}</motion.span></AnimatePresence><span className="text-[#333] mx-2">/</span><span>05</span></div></div>
          </div>

          <div className="w-full md:w-[65%] flex flex-col">
            <div className="border-b border-gray-800 p-8 text-[10px] font-mono text-gray-400 tracking-widest uppercase flex justify-between"><span>Explore the past. Understand the present.</span><AnimatePresence mode="wait"><motion.span key={activeChapter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Chapter 0{activeChapter + 1}</motion.span></AnimatePresence></div>
            <div className="flex flex-col px-8">
              {chaptersData.map((chapter, idx) => {
                const isActive = activeChapter === idx;
                return (
                  <button key={idx} onClick={() => setActiveChapter(idx)} className={`group w-full text-left py-8 border-b border-gray-800/80 flex justify-between items-center transition-colors duration-300 ${isActive ? "text-white" : "text-[#444] hover:text-[#999]"}`}>
                    <span className="text-2xl md:text-[2rem] font-medium tracking-tight">{chapter.name}</span>
                    <div className="w-8 h-8 flex items-center justify-end overflow-hidden">{isActive && (<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.3 }}><ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" /></motion.div>)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full border-t border-gray-800 bg-[#0a0a0a]"><div className="px-8 py-8 text-[10px] font-mono tracking-widest text-gray-500 uppercase">DIGGING INTO OUR PLANET'S PAST</div></div>
      </section>
    </div>
  );
}
