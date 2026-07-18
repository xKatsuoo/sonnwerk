import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

const advantages = [
  {
    title: "Alles aus einer Hand",
    description: "Analyse, Planung, Montage und Inbetriebnahme – ein Team, ein Ansprechpartner.",
  },
  {
    title: "Zertifizierte Qualität",
    description: "Nur geprüfte Komponenten führender Hersteller, verbaut von Meisterbetrieben.",
  },
  {
    title: "25 Jahre Leistungsgarantie",
    description: "Auf Module, Wechselrichter und Speicher – planbar für Generationen.",
  },
  {
    title: "Transparente Erträge",
    description: "Live-Monitoring Ihrer Anlage in einer App – jederzeit nachvollziehbar.",
  },
];

const stats = [
  { value: 4200, suffix: "+", label: "installierte Anlagen" },
  { value: 98, suffix: "%", label: "Kundenzufriedenheit" },
  { value: 25, suffix: " Jahre", label: "Garantie auf Module" },
  { value: 12, suffix: " Tage", label: "durchschnittliche Bauzeit" },
];

/** Trust-building highlight grid with proof-point stat counters, directly after the pinned story. */
export function Vorteile() {
  return (
    <section id="vorteile" className="bg-white py-28 sm:py-36">
      <Container>
        <SectionHeading
          kicker="Vorteile"
          title="Warum Eigentümer uns ihr Dach anvertrauen"
          description="Photovoltaik ist eine Investition auf Jahrzehnte. Wir sorgen dafür, dass sie sich von Tag eins an rechnet."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((item, i) => (
            <Reveal key={item.title} variant="up" delay={i * 0.06} className="bg-white p-8">
              <h3 className="text-ink text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="pretty mt-3 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-gray-100 pt-14 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} variant="fade" delay={i * 0.05}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
