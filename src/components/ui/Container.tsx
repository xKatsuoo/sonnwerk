import { cn } from "@/lib/cn";

/** Centers content with the site-wide max width and responsive horizontal padding. */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12", className)}>{children}</Tag>
  );
}
