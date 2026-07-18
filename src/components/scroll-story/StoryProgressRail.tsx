import { cn } from "@/lib/cn";

interface StoryProgressRailProps {
  total: number;
  active: number;
  visible: boolean;
}

/** A fixed dot-rail marking progress through all twelve beats of the pinned scroll story. */
export function StoryProgressRail({ total, active, visible }: StoryProgressRailProps) {
  return (
    <div
      className={cn(
        "fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col gap-2.5 transition-opacity duration-500 lg:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-all duration-300",
            i === active ? "bg-solar-blue h-5" : "bg-white/30",
          )}
        />
      ))}
    </div>
  );
}
