import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const programs = [
  {
    title: "KfW-Förderkredit 270",
    description: "Zinsgünstige Finanzierung für Photovoltaik- und Speichersysteme, bundesweit verfügbar.",
  },
  {
    title: "Einspeisevergütung",
    description: "Feste Vergütung für eingespeisten Solarstrom über 20 Jahre, gesetzlich garantiert.",
  },
  {
    title: "Regionale Zuschüsse",
    description: "Viele Bundesländer und Kommunen fördern Speicher und Wallboxen zusätzlich.",
  },
];

/** Compact overview of funding programs; deliberately factual and low-hype to match German expectations. */
export function Foerderungen() {
  return (
    <section id="foerderung" className="bg-gray-50 py-28 sm:py-36">
      <Container>
        <SectionHeading
          kicker="Förderungen"
          title="Staatliche Förderung nutzen"
          description="Wir prüfen für jede Anlage automatisch, welche Förderprogramme greifen, und übernehmen die Antragstellung."
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {programs.map((program, i) => (
            <Reveal key={program.title} variant="up" delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-gray-200 bg-white p-8">
                <h3 className="text-ink text-lg font-semibold tracking-tight">{program.title}</h3>
                <p className="pretty mt-3 text-sm leading-relaxed text-gray-500">{program.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="fade" delay={0.15}>
          <p className="mt-10 text-sm text-gray-400">
            Förderbedingungen unterliegen laufenden Anpassungen. Wir beraten Sie zum aktuellen Stand in Ihrem
            persönlichen Beratungsgespräch.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
