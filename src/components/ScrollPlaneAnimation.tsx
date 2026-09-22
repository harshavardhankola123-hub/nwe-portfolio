"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPlaneAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const plane = planeRef.current;
    const copy = copyRef.current;
    const next = nextRef.current;
    const trail = trailRef.current;
    if (!section || !plane || !copy || !next || !trail) return;

    const context = gsap.context(() => {
      const length = trail.getTotalLength();
      gsap.set(trail, { strokeDasharray: length, strokeDashoffset: length });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(plane, { x: 250, y: -20, rotate: 8, duration: 1, ease: "power2.inOut" }, 0)
        .to(trail, { strokeDashoffset: length * 0.72, duration: 1, ease: "none" }, 0)
        .to(copy, { x: -120, y: -40, opacity: 0, duration: 1, ease: "power2.in" }, 0.8)
        .to(plane, { x: 620, y: -285, rotate: 28, duration: 1, ease: "power2.inOut" }, 1)
        .to(trail, { strokeDashoffset: length * 0.4, duration: 1, ease: "none" }, 1)
        .to(plane, { x: 1050, y: -25, rotate: 8, duration: 1, ease: "power2.inOut" }, 2)
        .to(trail, { strokeDashoffset: length * 0.08, duration: 1, ease: "none" }, 2)
        .to(next, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 2.2)
        .to(plane, { x: 1320, y: 170, rotate: 20, scale: 0.85, duration: 0.8, ease: "power2.in" }, 2.8);

      gsap.to(plane, { y: "+=8", duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="plane-section" aria-label="Scroll animation">
      <div className="plane-background" />
      <div className="top-line" />
      <p className="top-description">Craft animations for any viewport size<br />with gsap.matchMedia()</p>
      <div ref={copyRef} className="main-copy"><div className="small-label">ScrollSmoother</div><h2>It&apos;s like a<br />gentle breeze</h2></div>
      <div ref={nextRef} className="second-copy"><h3>Effortlessly guiding<br />your users from one<br />section to another.</h3><p>Smooth interactions.<br />Natural movement.</p></div>
      <svg className="flight-trail" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><path ref={trailRef} d="M 170 650 C 180 480, 230 300, 420 220 C 580 150, 720 300, 660 430 C 600 560, 850 580, 1150 380" fill="none" stroke="var(--plane-trail)" strokeWidth="2" strokeLinecap="round" /></svg>
      <div ref={planeRef} className="paper-plane"><svg className="plane-svg" viewBox="0 0 230 150" aria-hidden="true"><polygon points="55,45 175,15 210,115" fill="var(--plane-dark)" /><polygon points="35,55 175,15 210,115" fill="var(--plane-main)" /><polygon points="35,55 210,115 85,95" fill="var(--plane-light)" /><polygon points="35,55 100,65 210,115" fill="var(--plane-fold)" opacity=".7" /></svg></div>
      <div className="bottom-decoration"><span /><span /></div>
    </section>
  );
}
