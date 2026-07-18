import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  {
    quote:
      "Von der ersten Beratung bis zur Inbetriebnahme hat alles reibungslos funktioniert. Die App zeigt mir jeden Tag, wie viel Energie wir selbst erzeugen.",
    name: "Familie R.",
    location: "München",
  },
  {
    quote:
      "Wir haben uns für Speicher und Wallbox in einem Paket entschieden. Die Montage war an einem Tag erledigt, sauber und professionell.",
    name: "T. Hoffmann",
    location: "Leipzig",
  },
  {
    quote:
      "Die Dachanalyse war erstaunlich genau. Der prognostizierte Ertrag liegt seit einem Jahr innerhalb von zwei Prozent der Realität.",
    name: "S. Baumann",
    location: "Freiburg",
  },
];

/** Simple, restrained testimonial grid — no star ratings or third-party badges to keep it honest. */
export function Referenzen() {
  return (
    <section id="referenzen" className="bg-gray-50 py-28 sm:py-36">
      <Container>
        <SectionHeading kicker="Referenzen" title="Was unsere Kunden sagen" align="left" />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} variant="up" delay={i * 0.07}>
              <figure className="flex h-full flex-col justify-between rounded-2xl bg-white p-8">
                <blockquote className="pretty text-base leading-relaxed text-gray-600">
                  „{t.quote}“
                </blockquote>
                <figcaption className="text-ink mt-6 text-sm font-medium">
                  {t.name} <span className="font-normal text-gray-400">— {t.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
