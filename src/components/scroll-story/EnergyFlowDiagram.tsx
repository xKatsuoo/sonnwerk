"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { captionOpacity, clamp01 } from "@/lib/crossfade";
import { diagramStoryPhases } from "@/data/storyPhases";
import { Button } from "@/components/ui/Button";

const SCROLL_VH = 4.5;
const CAPTION_MARGIN = 0.03;

const nodes = [
  { id: "sun", label: "Solarmodule" },
  { id: "inverter", label: "Wechselrichter" },
  { id: "battery", label: "Batteriespeicher" },
  { id: "house", label: "Hausnetz" },
  { id: "wallbox", label: "Wallbox" },
  { id: "smartHome", label: "Smart Home" },
] as const;

/** A minimal stroke-based icon per node, kept intentionally schematic rather than literal. */
function NodeIcon({ id }: { id: (typeof nodes)[number]["id"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "sun":
      return (
        <g {...common}>
          <circle cx="0" cy="0" r="12" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = Math.cos(angle) * 18;
            const y1 = Math.sin(angle) * 18;
            const x2 = Math.cos(angle) * 24;
            const y2 = Math.sin(angle) * 24;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      );
    case "inverter":
      return (
        <g {...common}>
          <rect x="-16" y="-20" width="32" height="40" rx="4" />
          <path d="M -6 4 L 2 -8 L 2 2 L 8 -10" />
        </g>
      );
    case "battery":
      return (
        <g {...common}>
          <rect x="-18" y="-14" width="36" height="28" rx="4" />
          <rect x="16" y="-6" width="4" height="12" />
          <rect x="-13" y="-9" width="10" height="18" fill="currentColor" stroke="none" opacity="0.85" />
        </g>
      );
    case "house":
      return (
        <g {...common}>
          <path d="M -20 4 L 0 -18 L 20 4" />
          <rect x="-14" y="4" width="28" height="18" />
          <rect x="-6" y="9" width="5" height="5" />
          <rect x="3" y="9" width="5" height="5" />
        </g>
      );
    case "wallbox":
      return (
        <g {...common}>
          <rect x="-20" y="-6" width="24" height="16" rx="2" />
          <circle cx="-13" cy="12" r="3" />
          <circle cx="-3" cy="12" r="3" />
          <path d="M 8 -14 L 8 10" />
          <path d="M 4 -10 L 12 -10" />
          <path d="M 4 -2 L 12 -2" />
        </g>
      );
    case "smartHome":
      return (
        <g {...common}>
          <rect x="-11" y="-20" width="22" height="40" rx="5" />
          <line x1="-6" y1="-10" x2="6" y2="-10" />
          <line x1="-6" y1="-2" x2="2" y2="-2" />
          <line x1="-6" y1="6" x2="4" y2="6" />
        </g>
      );
  }
}

interface EnergyFlowDiagramProps {
  onActivePhase: (index: number) => void;
}

/**
 * The second half of the pinned story: no footage exists for the electrical journey,
 * so it is told as a schematic SVG diagram whose reveal is scrubbed by scroll progress
 * exactly like the video above it, keeping the same one-continuous-motion feel.
 */
export function EnergyFlowDiagram({ onActivePhase }: EnergyFlowDiagramProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const glowRefs = useRef<Array<SVGCircleElement | null>>([]);
  const connectorRefs = useRef<Array<SVGLineElement | null>>([]);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    let lastActivePhase = -1;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * SCROLL_VH}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        let activeIndex = -1;

        nodes.forEach((_, i) => {
          const phase = diagramStoryPhases[i];
          const g = nodeRefs.current[i];
          const glow = glowRefs.current[i];
          if (!g) return;

          let opacity = 0;
          let scale = 0.82;
          let isActive = false;

          if (progress >= phase.start) {
            const introSpan = Math.max(0.001, (phase.end - phase.start) * 0.4);
            const introT = clamp01((progress - phase.start) / introSpan);
            opacity = introT;
            scale = 0.82 + introT * 0.18;
            isActive = progress >= phase.start && progress <= phase.end && introT > 0.85;
          }

          gsap.set(g, { opacity, transformOrigin: "center", scale });
          if (glow) gsap.set(glow, { opacity: isActive ? 0.55 : 0 });

          const connector = connectorRefs.current[i - 1];
          if (connector) {
            const connSpan = Math.max(0.001, (phase.end - phase.start) * 0.6);
            const connT = clamp01((progress - phase.start) / connSpan);
            gsap.set(connector, { opacity: connT });
          }

          if (opacity > 0.5) activeIndex = i;
        });

        diagramStoryPhases.forEach((phase, i) => {
          const el = captionRefs.current[i];
          if (!el) return;
          const opacity = captionOpacity(progress, phase.start, phase.end, CAPTION_MARGIN);
          gsap.set(el, { opacity, y: (1 - opacity) * 14 });
          if (opacity > 0.5) activeIndex = i;
        });

        if (badgeRef.current) {
          const phase = diagramStoryPhases[diagramStoryPhases.length - 1];
          const span = Math.max(0.001, (phase.end - phase.start) * 0.7);
          const t = clamp01((progress - phase.start) / span);
          gsap.set(badgeRef.current, { opacity: t, y: (1 - t) * 20 });
        }

        if (activeIndex !== -1 && activeIndex !== lastActivePhase) {
          lastActivePhase = activeIndex;
          onActivePhase(activeIndex);
        }
      },
    });

    return () => trigger.kill();
  }, [onActivePhase]);

  return (
    <section
      ref={sectionRef}
      className="bg-anthracite relative h-screen w-full overflow-hidden"
      aria-label="Wie die Solarenergie durch Ihr Zuhause fließt"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 px-6">
        <svg viewBox="0 0 1200 220" className="w-full max-w-5xl text-white" role="img" aria-hidden>
          <line
            x1="100"
            y1="110"
            x2="1100"
            y2="110"
            stroke="var(--color-gray-600)"
            strokeWidth="1.5"
            strokeDasharray="2 8"
          />
          {nodes.slice(0, -1).map((_, i) => (
            <line
              key={i}
              ref={(el) => {
                connectorRefs.current[i] = el;
              }}
              x1={100 + i * 200}
              y1="110"
              x2={100 + (i + 1) * 200}
              y2="110"
              stroke="var(--color-solar-blue)"
              strokeWidth="2"
              opacity="0"
            />
          ))}
          {nodes.map((node, i) => (
            <g
              key={node.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              transform={`translate(${100 + i * 200}, 110)`}
              opacity="0"
            >
              <circle
                ref={(el) => {
                  glowRefs.current[i] = el;
                }}
                r="42"
                fill="var(--color-solar-blue)"
                opacity="0"
              />
              <circle
                r="34"
                fill="var(--color-anthracite-soft)"
                stroke="var(--color-solar-blue)"
                strokeWidth="1.5"
              />
              <NodeIcon id={node.id} />
              <text
                y="60"
                textAnchor="middle"
                fill="var(--color-gray-300)"
                fontSize="14"
                className="font-sans"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="relative h-32 w-full max-w-2xl text-center">
          {diagramStoryPhases.map((phase, i) => (
            <div
              key={phase.id}
              ref={(el) => {
                captionRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 opacity-0"
            >
              <span className="text-solar-blue-light mb-3 inline-block text-sm font-medium tracking-wide uppercase">
                {phase.kicker}
              </span>
              <h2 className="balance text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
                {phase.title}
              </h2>
              <p className="pretty mt-4 text-base leading-relaxed text-gray-400">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={badgeRef}
        className="absolute inset-x-0 bottom-16 z-10 flex flex-col items-center gap-6 px-6 opacity-0"
      >
        <Button href="#kontakt" variant="primary">
          Jetzt unverbindlich planen lassen
        </Button>
      </div>
    </section>
  );
}
