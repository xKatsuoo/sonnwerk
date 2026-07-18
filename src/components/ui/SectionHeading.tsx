import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

/** The recurring kicker + headline + intro pattern used at the top of every content section. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div className={cn("max-w-2xl", isCenter && "mx-auto text-center", className)}>
      {kicker && (
        <Reveal variant="fade">
          <span
            className={cn(
              "mb-4 inline-block text-sm font-medium tracking-wide uppercase",
              isDark ? "text-solar-blue-light" : "text-solar-blue",
            )}
          >
            {kicker}
          </span>
        </Reveal>
      )}
      <Reveal variant="up" delay={0.05}>
        <h2
          className={cn(
            "balance text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl",
            isDark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal variant="up" delay={0.12}>
          <p
            className={cn("pretty mt-5 text-lg leading-relaxed", isDark ? "text-gray-300" : "text-gray-500")}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
