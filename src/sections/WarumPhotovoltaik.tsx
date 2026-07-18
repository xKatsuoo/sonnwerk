import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const reasons = [
  {
    number: "01",
    title: "Unabhängig von Strompreisen",
    description:
      "Wer eigenen Strom erzeugt, spürt steigende Energiepreise kaum noch. Ihre Anlage amortisiert sich unabhängig vom Markt.",
  },
  {
    number: "02",
    title: "Wertsteigerung der Immobilie",
    description:
      "Eine moderne PV-Anlage mit Speicher gehört zu den gefragtesten Ausstattungsmerkmalen am Immobilienmarkt.",
  },
  {
    number: "03",
    title: "Aktiver Klimaschutz",
    description:
      "Ein durchschnittliches Einfamilienhaus mit PV-Anlage spart jährlich mehrere Tonnen CO₂ – messbar und real.",
  },
];

/** Editorial three-column rationale block explaining the "why" before the product detail sections. */
export function WarumPhotovoltaik() {
  return (
    <section className="bg-gray-50 py-28 sm:py-36">
      <Container>
        <SectionHeading
          kicker="Warum Photovoltaik"
          title="Die Energiewende beginnt auf Ihrem Dach"
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          {reasons.map((reason, i) => (
            <Reveal key={reason.number} variant="up" delay={i * 0.08}>
              <span className="font-mono text-sm text-gray-400">{reason.number}</span>
              <h3 className="text-ink mt-4 text-2xl font-semibold tracking-tight">{reason.title}</h3>
              <p className="pretty mt-4 text-base leading-relaxed text-gray-500">{reason.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
