import { Container } from "@/components/ui/Container";

/** Shared prose shell for the legal pages (Impressum, Datenschutz, AGB). */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-40 pb-28">
      <Container>
        <h1 className="text-ink text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <div className="prose-legal mt-12 max-w-2xl space-y-8 text-base leading-relaxed text-gray-600">
          {children}
        </div>
      </Container>
    </div>
  );
}
