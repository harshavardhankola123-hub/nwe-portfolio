"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

function GridBackground() {
  return <div aria-hidden="true" className="grid-background" />;
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return <span className="mono-label">{children}</span>;
}

function NinjaSprite() {
  return (
    <div className="ninja" aria-hidden="true">
      <div className="ninja-shadow" />
      <div className="scarf scarf-one" />
      <div className="scarf scarf-two" />
      <div className="katana" />
      <div className="ninja-head"><span className="headband" /></div>
      <div className="ninja-body" />
      <div className="ninja-leg ninja-leg-left" />
      <div className="ninja-leg ninja-leg-right" />
    </div>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const vardhanRef = useRef<HTMLSpanElement>(null);
  const [ninjaPosition, setNinjaPosition] = useState({ x: 0, y: 0 });
  const [spawned, setSpawned] = useState(false);
  const reduceMotion = useReducedMotion();

  const measureV = useCallback(() => {
    const hero = heroRef.current;
    const letter = vardhanRef.current;
    if (!hero || !letter) return;
    const heroRect = hero.getBoundingClientRect();
    const letterRect = letter.getBoundingClientRect();
    setNinjaPosition({
      x: letterRect.left - heroRect.left + letterRect.width * 0.28,
      y: letterRect.top - heroRect.top - 42,
    });
  }, []);

  useEffect(() => {
    measureV();
    window.addEventListener("resize", measureV);
    return () => window.removeEventListener("resize", measureV);
  }, [measureV]);

  const spawn = () => {
    measureV();
    setSpawned(true);
  };

  return (
    <main ref={heroRef} className="hero" onMouseMove={spawn} onTouchStart={spawn}>
      <GridBackground />
      <header className="hero-header">
        <MonoLabel>[001 // EDITORIAL HERO ARCHIVE]</MonoLabel>
        <MonoLabel>SYSTEM STATUS: INTERACTIVE RIG ARMED</MonoLabel>
      </header>
      <div className="hero-rule" />
      <div className="hero-content">
        <p className="hero-kicker">PORTFOLIO / 2026</p>
        <h1 className="hero-title" aria-label="Kola Harsha Vardhan">
          <span>KOLA</span>
          <span className="outline">HARSHA&mdash;</span>
          <span><span ref={vardhanRef}>V</span>ARDHAN<i aria-hidden="true" /></span>
        </h1>
        <p className="hero-footer">DESIGN ENGINEER <b>·</b> AI SYSTEMS <b>·</b> MOTION INTERFACES</p>
      </div>
      {spawned && (
        <motion.div
          className="ninja-position"
          initial={reduceMotion ? false : { scale: 0, opacity: 0, y: -80 }}
          animate={{ scale: 1, opacity: 1, x: ninjaPosition.x, y: ninjaPosition.y }}
          transition={{ type: "spring", stiffness: 460, damping: 19, mass: 0.7 }}
        >
          <NinjaSprite />
        </motion.div>
      )}
      <div className="hero-index"><MonoLabel>SCROLL TO EXPLORE</MonoLabel><MonoLabel>01 / 01</MonoLabel></div>
    </main>
  );
}

export function Portfolio() {
  return <Hero />;
}

export { Hero, NinjaSprite, GridBackground, MonoLabel };
