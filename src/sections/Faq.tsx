import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const faqItems = [
  {
    question: "Wie lange dauert die Installation einer Photovoltaikanlage?",
    answer:
      "Die reine Montagezeit beträgt in der Regel ein bis drei Tage. Von der ersten Beratung bis zur Inbetriebnahme vergehen im Durchschnitt vier bis acht Wochen, abhängig von Netzbetreiber und Bauamt.",
  },
  {
    question: "Lohnt sich ein Batteriespeicher wirklich?",
    answer:
      "Ohne Speicher nutzen die meisten Haushalte nur 25 bis 35 % ihres Solarstroms selbst. Mit Speicher steigt der Eigenverbrauch auf bis zu 80 %, was die Amortisationszeit der Gesamtanlage deutlich verkürzt.",
  },
  {
    question: "Was passiert bei einem Stromausfall?",
    answer:
      "Mit einer Notstromfunktion versorgen ausgewählte Speichersysteme Ihr Haus auch bei einem Netzausfall weiter – automatisch und ohne spürbare Unterbrechung.",
  },
  {
    question: "Ist mein Dach für Photovoltaik geeignet?",
    answer:
      "Fast jede Dachform eignet sich – Ausrichtung, Neigung und Verschattung beeinflussen lediglich den Ertrag. Unsere digitale Dachanalyse zeigt Ihnen das genaue Potenzial vorab, kostenlos und unverbindlich.",
  },
  {
    question: "Welche Garantien erhalte ich?",
    answer:
      "Sie erhalten 25 Jahre Leistungsgarantie auf die Module, 10 Jahre Produktgarantie auf Wechselrichter und Speicher sowie 5 Jahre Garantie auf die Montageleistung.",
  },
];

/** Answers the objections that typically block a purchase decision, kept to five entries. */
export function Faq() {
  return (
    <section id="faq" className="bg-white py-28 sm:py-36">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <SectionHeading kicker="FAQ" title="Häufige Fragen" align="left" />
          <Reveal variant="up">
            <FaqAccordion items={faqItems} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
