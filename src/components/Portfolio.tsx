"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring, MotionStyle } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from "lucide-react";

const projects = [
  {
    no: "01",
    year: "2025",
    title: "Personalized Learning Application",
    tag: "Adaptive AI / Education",
    url: "https://learninggenzai.ai.studio",
    blurb:
      "A learner-modeling engine that maps strengths, gaps, and tempo through historical signals — then orchestrates content, difficulty, and a generative tutor in real time.",
    pillars: ["Learner Profile Modeling", "Adaptive Recommendation", "Predictive Tracking", "LLM Feedback Loop", "React Dashboard"],
    palette: ["#ff3b1f", "#0a0a0a", "#f5f1e8"],
  },
  {
    no: "02",
    year: "2025",
    title: "MedMind AI",
    tag: "Healthcare / Conversational AI",
    url: "https://medimind-ai-project-phi.vercel.app",
    blurb:
      "A thoughtful medical AI companion that understands symptoms and health context — turning complex information into clear guidance, useful next steps, and a calmer care journey.",
    pillars: ["Medical Knowledge Support", "Symptom Context Understanding", "Personalized Guidance", "Conversational AI", "Accessible Health Dashboard"],
    palette: ["#8ccfc9", "#0a0a0a", "#f5f1e8"],
  },
];

const skills = {
  Languages: ["Python", "JavaScript", "Java"],
  Interface: ["HTML5", "CSS3", "React"],
  Systems: ["Claude", "n8n", "GitHub"],
};

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[210] h-1 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 30, stiffness: 250 });
  const sy = useSpring(y, { damping: 30, stiffness: 250 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHover(!!t.closest?.("a, button, [data-magnet]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed z-200 hidden md:block"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" } as MotionStyle}
    >
      <motion.div
        animate={{ scale: hover ? 3.2 : 1, opacity: hover ? 0.9 : 1 }}
        transition={{ type: "spring", damping: 18, stiffness: 220 }}
        className="h-3 w-3 rounded-full bg-accent mix-blend-difference"
      />
    </motion.div>
  );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden border-y border-foreground/15 bg-ink text-paper">
      <div
        className="marquee flex whitespace-nowrap py-5 text-2xl font-medium tracking-tight md:text-3xl"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            <span>{t}</span>
            <span className="text-accent">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 200 });
  const sy = useSpring(y, { damping: 15, stiffness: 200 });

  return (
    <motion.div
      ref={ref}
      data-magnet
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PaperRocket() {
  return (
    <svg viewBox="0 0 80 42" aria-hidden="true" className="h-full w-full overflow-visible">
      <path d="M8 27 62 5c7-3 13-2 15-1-1 3-3 8-9 13L16 35Z" fill="currentColor" />
      <path d="m16 34 9-12 9 8Z" fill="currentColor" opacity=".72" />
      <path d="m62 5-27 17 25-5c6-4 9-9 10-13Z" fill="white" opacity=".28" />
      <circle cx="59" cy="12" r="3" fill="var(--paper)" opacity=".9" />
      <path d="M12 30 2 39l16-5" fill="var(--accent)" />
      <path d="M4 39c5-1 9-2 13-5" fill="none" stroke="var(--accent)" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function RocketAnimation({ heroRef, lettersRef }: { heroRef: React.RefObject<HTMLElement | null>; lettersRef: React.MutableRefObject<Record<string, HTMLSpanElement | null>> }) {
  const reduceMotion = useReducedMotion();
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.8 });

  useEffect(() => {
    const measure = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const heroRect = hero.getBoundingClientRect();
      setPoints(["K", "A1", "H", "A2", "N"].map((letter) => {
        const rect = lettersRef.current[letter]?.getBoundingClientRect();
        return rect ? { x: rect.left - heroRect.left - 18, y: rect.top - heroRect.top + rect.height * 0.42 } : { x: 0, y: 0 };
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (heroRef.current) observer.observe(heroRef.current);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [heroRef, lettersRef]);

  const [k, a1, h, a2, n] = points.length === 5 ? points : Array.from({ length: 5 }, () => ({ x: 0, y: 0 }));
  const x = useTransform(smoothProgress, [0, 0.2, 0.42, 0.64, 0.82, 1], [k.x, a1.x, h.x, a2.x, n.x, "calc(100vw + 80px)"]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.42, 0.64, 0.82, 1], [k.y, a1.y, h.y, a2.y, n.y, n.y]);
  const rotate = useTransform(smoothProgress, [0, 0.2, 0.42, 0.64, 0.82, 1], [-8, 2, -4, 3, -2, 8]);

  if (reduceMotion || points.length !== 5) return null;

  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 h-10 w-[76px] text-accent drop-shadow-[0_5px_0_rgba(0,0,0,0.12)]" style={{ x, y, rotate }}>
      <PaperRocket />
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<Record<string, HTMLSpanElement | null>>({});
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 projection" />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-foreground/15 px-6 py-4 font-mono text-xs uppercase tracking-widest md:px-10">
        <span>K · H — Studio / 2026</span>
        <span className="hidden md:inline">Tirupati ⇄ Earth · 13.6288°N</span>
        <span className="flicker text-accent">● rec</span>
      </div>

      <motion.div style={{ y: y1, opacity: op }} className="relative z-10 px-6 pt-16 md:px-10 md:pt-24">
        <RocketAnimation heroRef={ref} lettersRef={lettersRef} />
        <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>Issue №01 — Portfolio</span>
          <span>B.Tech ECE · CGPA 8.9</span>
        </div>

        <h1 className="mt-10 font-display font-medium hero-title">
          <span className="block">
            <span ref={(node) => { lettersRef.current.K = node; }} className="cursor-pointer">K</span>OL<span ref={(node) => { lettersRef.current.A1 = node; }}>A</span>
          </span>
          <span className="block text-stroke">
            <span ref={(node) => { lettersRef.current.H = node; }}>H</span>ARSH<span ref={(node) => { lettersRef.current.A2 = node; }}>A</span>&mdash;
          </span>
          <span className="block">
            VARDHA<span ref={(node) => { lettersRef.current.N = node; }}>N</span><span className="text-accent">.</span>
          </span>
        </h1>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="relative z-10 mt-12 grid grid-cols-1 gap-8 px-6 pb-20 md:grid-cols-12 md:px-10"
      >
        <div className="md:col-span-5 md:col-start-1">
          <p className="font-serif text-3xl italic leading-tight md:text-5xl">
            React developer and AI builder crafting <span className="text-accent">intelligent interfaces</span> with Python, JavaScript, Java, automation, and thoughtful visual systems.
          </p>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">— Index</p>
          <ul className="mt-4 space-y-2 font-display text-lg">
            {["Selected Work", "Process", "Skills", "Studio", "Contact"].map((s, i) => (
              <li key={s} className="flex items-baseline justify-between border-b border-foreground/15 py-2">
                <span>{s}</span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: (typeof projects)[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const reverse = i % 2 === 1;

  return (
    <article 
      ref={ref} 
      className={`relative border-b border-foreground/15 py-16 md:py-24 ${p.url ? "cursor-pointer group/card" : ""}`}
      onClick={() => p.url && window.open(p.url, "_blank")}
    >
      <div className="grid grid-cols-12 gap-6 px-6 md:px-10">
        <div className={`col-span-12 md:col-span-7 ${reverse ? "md:order-2 md:col-start-6" : ""}`}>
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>№ {p.no}</span>
            <span className="h-px flex-1 bg-foreground/20" />
            <span>{p.year}</span>
            <span>{p.tag}</span>
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-7xl group-hover/card:text-accent transition-colors"
          >
            {p.title}
            {p.url && <ArrowUpRight className="inline-block ml-4 h-8 w-8 transition-transform group-hover/card:rotate-45 md:h-12 md:w-12" />}
          </motion.h3>

          <p className="mt-6 max-w-xl font-serif text-xl italic leading-snug text-foreground/80 md:text-2xl">
            {p.blurb}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-2 font-mono text-xs uppercase tracking-widest sm:grid-cols-2">
            {p.pillars.map((pl, j) => (
              <li key={pl} className="flex items-center gap-3 border-l-2 border-accent pl-3">
                <span className="text-muted-foreground">0{j + 1}</span>
                <span>{pl}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          style={{ y }}
          className={`col-span-12 md:col-span-4 ${reverse ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}
        >
          <Poster colors={p.palette} label={p.title} no={p.no} />
        </motion.div>
      </div>
    </article>
  );
}

function Poster({ colors, label, no }: { colors: string[]; label: string; no: string }) {
  const [a, b, c] = colors;
  return (
    <motion.div
      whileHover={{ rotate: -1.5, scale: 1.02 }}
      transition={{ type: "spring", damping: 18, stiffness: 180 }}
      className="relative aspect-3-4 w-full overflow-hidden border border-foreground/20 poster-shadow"
      style={{ background: c }}
    >
      <div className="absolute inset-0 grain opacity-60" />
      <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: b }}>
        Specimen · {no}
      </div>
      <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: b }}>
        300dpi
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute right-6 bottom-6 h-20 w-20 rounded-full"
        style={{ background: a, mixBlendMode: "multiply" }}
      />
      <div className="absolute left-0 right-0 top-1/3 px-4">
        <div className="font-display text-[18vw] md:text-[5vw] font-bold leading-[0.85] tracking-tighter" style={{ color: b }}>
          {label.split(" ").slice(0, 2).join(" ")}
        </div>
      </div>
      <div
        className="absolute bottom-4 left-4 right-4 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: b }}
      >
        ▮▮▮▯▯ — frame 042 / scrub →
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: a }} />
    </motion.div>
  );
}

function ProfileCard() {
  return (
    <article
      tabIndex={0}
      aria-label="Reveal Harshavardhan's portrait"
      className="group relative mt-12 min-h-80 overflow-hidden border border-foreground/20 bg-ink text-paper outline-none transition-transform duration-500 hover:-rotate-1 focus:-rotate-1 md:mt-0 md:min-h-[30rem]"
    >
      <div className="absolute inset-0 grain opacity-60" />
      <div className="relative z-10 flex h-full min-h-80 flex-col justify-between p-5 md:min-h-[30rem]">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-paper/70">
          <span>Portrait · 001</span>
          <span>Hover / Focus</span>
        </div>
        <div>
        </div>
      </div>
      <div className="absolute inset-0 translate-y-full opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
        <Image
          src="/images/harshavardhan.webp"
          alt="Portrait of Kola Harshavardhan wearing glasses and a white shirt"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover object-center grayscale transition-transform duration-1000 group-hover:scale-105 group-focus:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-paper">
          <span className="bg-ink/80 px-3 py-2 text-xs font-semibold tracking-[0.2em] text-paper backdrop-blur-sm">Kola Harshavardhan</span>
          <span>↗</span>
        </div>
      </div>
    </article>
  );
}

function Skills() {
  return (
    <section className="relative bg-ink py-24 text-paper md:py-32">
      <Reveal className="px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-paper/60">
          <span>§ 03</span><span className="h-px flex-1 bg-paper/20" /><span>Toolkit</span>
        </div>

        <h2 className="mt-8 font-display text-6xl font-medium leading-[0.9] tracking-tight md:text-9xl">
          <span className="font-serif italic text-accent">Skills</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {Object.entries(skills).map(([k, v]) => (
            <div key={k} className="border-t border-paper/20 pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-paper/50">{k}</p>
              <ul className="mt-6 space-y-3">
                {v.map((s) => (
                  <li key={s} className="font-display text-3xl font-medium md:text-4xl">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section className="relative bg-paper py-24 text-ink md:py-32">
      <Reveal className="grid grid-cols-12 gap-6 px-6 md:px-10">
        <div className="col-span-12 md:col-span-4">
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>§ 04</span><span className="h-px w-12 bg-foreground/20" /><span>Studio</span>
          </div>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">Education</p>
          <div className="mt-4 space-y-6">
            <div className="border-l-2 border-accent pl-4">
              <p className="font-display text-xl font-medium">B.Tech, ECE</p>
              <p className="text-sm text-muted-foreground">VEMU Institute of Technology</p>
              <p className="font-mono text-xs text-muted-foreground">2023 — 2027 · CGPA 8.9</p>
            </div>
            <div className="border-l-2 border-foreground/30 pl-4">
              <p className="font-display text-xl font-medium">Intermediate · MPC</p>
              <p className="text-sm text-muted-foreground">Sri Chaitanya Junior College</p>
              <p className="font-mono text-xs text-muted-foreground">2021 — 2023 · 844</p>
            </div>
            <div className="border-l-2 border-foreground/30 pl-4">
              <p className="font-display text-xl font-medium">SSC</p>
              <p className="text-sm text-muted-foreground">Sri Venkateswara Children High School</p>
              <p className="font-mono text-xs text-muted-foreground">2021 · 600</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <p className="font-serif text-4xl italic leading-[1.05] md:text-6xl">
            I build at the seam between{" "}
            <span className="text-accent">code</span>, AI, and visual systems — using React, Python, JavaScript, Java, and automation tools to make products that feel clear, useful, and alive.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-foreground/15 pt-6 font-mono text-xs uppercase tracking-widest md:grid-cols-4">
            {[
              ["02", "Shipped projects"],
              ["8.9", "Current CGPA"],
              ["03", "Core stacks"],
              ["∞", "Curiosity loops"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-4xl font-medium text-foreground">{n}</div>
                <div className="mt-2 text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  const links = [
    { label: "harshavardhan.kola123@gmail.com", href: "mailto:harshavardhan.kola123@gmail.com", icon: Mail },
    { label: "+91 99890 90270", href: "tel:+919989090270", icon: Phone },
    { label: "GitHub", href: "https://github.com", icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  ];
  return (
    <section className="relative overflow-hidden bg-accent py-24 text-accent-foreground md:py-32">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <Reveal className="relative px-6 md:px-10">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest opacity-70">
          <span>§ 05</span><span className="h-px flex-1 bg-current opacity-30" /><span>Commission</span>
        </div>
        <h2 className="mt-8 font-display text-7xl font-medium leading-[0.85] tracking-[-0.04em] md:text-[14vw]">
          Let&apos;s build <span className="font-serif italic">something</span> that moves.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {links.map((l) => (
            <Magnetic key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border-y border-current/30 py-6 transition-colors hover:bg-ink/10"
              >
                <span className="flex items-center gap-4">
                  <l.icon className="h-5 w-5" />
                  <span className="font-display text-xl md:text-2xl">{l.label}</span>
                </span>
                <ArrowUpRight className="h-6 w-6 transition-transform group-hover:rotate-45" />
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="mt-20 flex items-end justify-between font-mono text-xs uppercase tracking-widest opacity-70">
          <span>© 2026 — Kola Harshavardhan</span>
          <span>Set in Space Grotesk · Instrument Serif</span>
        </div>
      </Reveal>
    </section>
  );
}

export function Portfolio() {
  const [showProjects, setShowProjects] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);

  return (
    <main className="relative">
      <ScrollProgress />
      <Cursor />
      <Hero />
      <Marquee items={["React Development", "Python Automation", "JavaScript Interfaces", "Java Applications", "AI Prototyping", "Workflow Automation"]} />
      <section className="bg-paper">
        <div className="pt-24" />
        <div className="grid grid-cols-1 gap-8 px-6 pb-16 md:grid-cols-12 md:items-end md:px-10">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <span>§ 02</span><span className="h-px flex-1 bg-foreground/20" /><span>Selected Work · 2024—2026</span>
            </div>
            <button
              type="button"
              aria-expanded={showProjects}
              onClick={() => setShowProjects((visible) => !visible)}
              className="group mt-6 flex items-center gap-5 text-left"
            >
              <h2 className="font-display text-6xl font-medium leading-[0.9] tracking-tight md:text-8xl">
                <span className="font-serif italic text-accent transition-colors group-hover:text-ink">Projects</span>
              </h2>
              <span className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-transform group-hover:translate-y-1">
                {showProjects ? "Hide ↑" : "Open ↓"}
              </span>
            </button>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <ProfileCard />
          </div>
        </div>
        <AnimatePresence initial={false}>
          {showProjects && (
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {projects.map((p, i) => <ProjectCard key={p.no} p={p} i={i} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section className="bg-paper px-6 py-24 md:px-10 md:py-32">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span>§ 03</span><span className="h-px flex-1 bg-foreground/20" /><span>Certification Archive</span>
        </div>
        <button
          type="button"
          aria-expanded={showCertifications}
          onClick={() => setShowCertifications((visible) => !visible)}
          className="group mt-6 flex items-center gap-5 text-left"
        >
          <h2 className="font-display text-6xl font-medium leading-[0.9] tracking-tight md:text-8xl">
            <span className="font-serif italic text-accent transition-colors group-hover:text-ink">Certifications</span>
          </h2>
          <span className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {showCertifications ? "Hide ↑" : "Open ↓"}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {showCertifications && (
            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {[
                { title: "AI Learning Lab", issuer: "Google Developer Experts · July 2026", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20115553-PIundp0fwFSp0JfQz08b99D0pwuv9l.png", href: "/certificates/google-ai-learning-lab.pdf" },
                { title: "GenAI-Powered Data Analytics", issuer: "Tata / Forage · January 2026", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20115428-qhBlay9DKXs0mPdVpWqRYVFOoTjk9d.png", href: "/certificates/tata-genai-powered-data-analytics.pdf" },
                { title: "AI and n8n Internship", issuer: "Kairokume Pvt. Ltd. · June–July 2026", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20115825-Hr3dsfSlHlS4yQo4FCHiP4TFCfc5Ij.png", href: "/certificates/ai-n8n-internship.pdf" },
                { title: "JavaScript (Basic)", issuer: "HackerRank · August 2026", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20114913-GS2Ku6skmVij22PFjES2Of32m3zE7T.png", href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20114913-GS2Ku6skmVij22PFjES2Of32m3zE7T.png" },
                { title: "Python (Basic)", issuer: "HackerRank · August 2026", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20114933-uTNWaO15ljCO1J5r7q1zSevTmUFyuQ.png", href: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-09-17%20114933-uTNWaO15ljCO1J5r7q1zSevTmUFyuQ.png" },
              ].map((certificate) => (
                <a key={certificate.title} href={certificate.href} target="_blank" rel="noreferrer" className="group border border-foreground/15 bg-background p-3 transition-transform duration-500 hover:-translate-y-2">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={certificate.image} alt={`${certificate.title} certificate preview`} className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                  </div>
                  <div className="px-2 pb-2 pt-5">
                    <h3 className="font-display text-2xl font-medium leading-none">{certificate.title}</h3>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{certificate.issuer}</p>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-accent">Open certificate ↗</p>
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Marquee reverse items={["Adaptive Learning", "Conversational AI", "Medical AI Support", "Predictive Tracking", "LLM Feedback", "Accessible Dashboards"]} />
      <Skills />
      <About />
      <Contact />
    </main>
  );
}
