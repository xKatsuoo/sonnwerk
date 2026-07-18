import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { step: "01", title: "Beratung", description: "Kostenloses Erstgespräch – persönlich oder digital." },
  { step: "02", title: "Dachanalyse", description: "Vermessung per Satellit und Vor-Ort-Termin." },
  { step: "03", title: "Angebot", description: "Individuelle Planung mit Ertragsprognose." },
  { step: "04", title: "Montage", description: "Installation durch zertifizierte Fachbetriebe." },
  { step: "05", title: "Betrieb", description: "Inbetriebnahme, Monitoring, laufender Support." },
];

/** Horizontal numbered timeline explaining the customer journey from inquiry to operation. */
export function Ablauf() {
  return (
    <section id="ablauf" className="bg-white py-28 sm:py-36">
      <Container>
        <SectionHeading kicker="Ablauf" title="In fünf Schritten zur eigenen Anlage" align="left" />

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((item, i) => (
            <Reveal key={item.step} variant="up" delay={i * 0.06}>
              <div className="border-ink border-t-2 pt-6">
                <span className="font-mono text-sm text-gray-400">{item.step}</span>
                <h3 className="text-ink mt-3 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="pretty mt-2 text-sm leading-relaxed text-gray-500">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
