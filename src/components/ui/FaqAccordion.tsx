"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface FaqItem {
  question: string;
  answer: string;
}

/** Single-open accordion for FAQ entries, fully keyboard operable via native <button>. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="text-ink text-lg font-medium tracking-tight">{item.question}</span>
              <span
                className={cn(
                  "text-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-transform duration-300",
                  isOpen && "border-solar-blue text-solar-blue rotate-45",
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={cn(
                "grid overflow-hidden transition-all duration-400 ease-out",
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <p className="pretty max-w-2xl text-base leading-relaxed text-gray-500">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
