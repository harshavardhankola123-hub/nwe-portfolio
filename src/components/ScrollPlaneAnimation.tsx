"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function PaperPlane() {
  return (
    <svg className="scroll-plane-svg" viewBox="0 0 220 150" role="img" aria-label="Paper airplane">
      <defs>
        <linearGradient id="plane-main" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff9fb9" />
          <stop offset="0.5" stopColor="#c8a5ff" />
          <stop offset="1" stopColor="#8bdcf7" />
        </linearGradient>
        <linearGradient id="plane-fold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4d7ff" />
          <stop offset="1" stopColor="#9c70e8" />
        </linearGradient>
        <filter id="plane-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#b97cff" floodOpacity="0.32" />
        </filter>
      </defs>
      <g filter="url(#plane-shadow)" stroke="#fff" strokeOpacity="0.35" strokeWidth="1">
        <path d="M13 69 205 15 119 101 94 76Z" fill="url(#plane-main)" />
        <path d="m13 69 81 7 25 25-34-18Z" fill="#f9aac5" />
        <path d="M94 76 205 15l-86 86Z" fill="url(#plane-fold)" />
        <path d="m119 101 11-54 75-32-86 86Z" fill="#a886ef" opacity=".72" />
        <path d="m130 47 75-32-86 86Z" fill="#8ddff8" opacity=".48" />
      </g>
    </svg>
  );
}

export function ScrollPlaneAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const trailGlowRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const section = sectionRef.current;
    if (!section) return;
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const mm = gsap.matchMedia();
      mm.add({
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
      }, (match) => {
        const isDesktop = Boolean(match.conditions?.desktop);
        const path = isDesktop
          ? "M 130 620 C 150 470, 260 270, 470 210 C 660 150, 760 320, 665 450 C 580 570, 880 585, 1220 325"
          : "M 48 650 C 65 500, 120 350, 250 280 C 390 210, 390 390, 330 470 C 300 530, 470 570, 650 360";
        const viewBox = isDesktop ? "0 0 1280 720" : "0 0 700 720";
        const length = isDesktop ? 1420 : 820;
        const pathNode = trailRef.current;
        const glowNode = trailGlowRef.current;
        if (!pathNode || !glowNode) return;
        pathNode.setAttribute("d", path);
        glowNode.setAttribute("d", path);
        section.dataset.viewBox = viewBox;
        gsap.set([pathNode, glowNode], { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(planeRef.current, { xPercent: -50, yPercent: -50 });
        gsap.set(secondTextRef.current, { opacity: 0, y: 70 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=3200" : "+=2500",
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(planeRef.current, { motionPath: { path, autoRotate: true, alignOrigin: [0.5, 0.5] }, duration: 1, ease: "none" }, 0)
          .to([pathNode, glowNode], { strokeDashoffset: 0, duration: 0.88, ease: "none" }, 0.04)
          .to(firstTextRef.current, { x: isDesktop ? -180 : -40, opacity: 0, duration: 0.48, ease: "power2.inOut" }, 0.43)
          .to(secondTextRef.current, { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" }, 0.58);
        return () => timeline.kill();
      });
      return () => mm.revert();
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="scroll-plane-section" aria-label="Scroll-driven paper airplane animation">
      <div className="scroll-plane-topline">Craft animations for any viewport size <span>with gsap.matchMedia()</span></div>
      <div className="scroll-plane-copy" ref={firstTextRef}>
        <p className="scroll-plane-kicker">ScrollSmoother</p>
        <h2>It&apos;s like a<br />gentle breeze</h2>
      </div>
      <div className="scroll-plane-copy scroll-plane-copy-next" ref={secondTextRef}>
        <p>Effortlessly guiding<br />your users from one<br />section to another.</p>
      </div>
      <svg className="scroll-plane-trail" viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true">
        <path ref={trailGlowRef} className="scroll-plane-trail-glow" />
        <path ref={trailRef} className="scroll-plane-trail-line" />
      </svg>
      <div ref={planeRef} className="scroll-plane" style={{ left: "0px", top: "0px" }}><PaperPlane /></div>
    </section>
  );
}

export default ScrollPlaneAnimation;
