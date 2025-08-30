'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '@/lib/constants';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const endElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cards = cardsRef.current;
    const endElement = endElementRef.current;
    const container = containerRef.current;

    if (!cards.length || !endElement || !container) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Set up smooth scrolling
    ScrollTrigger.normalizeScroll(true);

    // Animation for each card
    cards.forEach((card, i) => {
      gsap.to(card, {
        scale: () => 0.8 + i * 0.035,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: `top-=${40 * i} 40%`,
          end: "top 20%",
          scrub: true
        }
      });

      ScrollTrigger.create({
        trigger: card,
        start: `top-=${40 * i} 40%`,
        end: "top center",
        endTrigger: endElement,
        pin: true,
        pinSpacing: false,
        id: `card-${i}`
      });
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="stackingcards-container" ref={containerRef}>
      <div className="stackingcards">
        {SERVICES.map((service, index) => (
          <div
            key={service.slug}
            ref={(el) => {
              if (el) cardsRef.current[index] = el;
            }}
            className="stackingcard"
          >
            <h3 className="title">{service.title}</h3>
            <div className="text">{service.description}</div>
          </div>
        ))}
      </div>
      <div className="end-element" ref={endElementRef}></div>
    </div>
  );
}
