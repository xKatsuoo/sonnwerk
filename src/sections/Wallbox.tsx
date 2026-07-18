import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const specs = [
  { label: "Ladeleistung", value: "bis 22 kW" },
  { label: "Ladezeit", value: "ca. 3 Std." },
  { label: "Steuerung", value: "App & PV-optimiert" },
  { label: "Installation", value: "1 Tag" },
];

/** Mirrors the Stromspeicher layout with reversed image/text order for visual rhythm. */
export function Wallbox() {
  return (
    <section id="wallbox" className="bg-white py-28 sm:py-36">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal variant="scale" delay={0.1} className="order-2 lg:order-1">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-10">
              <div className="grid grid-cols-2 gap-8">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-sm text-gray-500">{spec.label}</p>
                    <p className="text-ink mt-2 font-mono text-2xl font-semibold tracking-tight">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 h-px w-full bg-gray-200" />
              <p className="mt-6 text-sm leading-relaxed text-gray-500">
                Überschüssiger Solarstrom lädt Ihr Elektroauto automatisch – gesteuert von unserer
                Smart-Home-Integration.
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal variant="fade">
              <span className="text-solar-blue mb-4 inline-block text-sm font-medium tracking-wide uppercase">
                Wallbox
              </span>
            </Reveal>
            <Reveal variant="up" delay={0.05}>
              <h2 className="balance text-ink text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
                Tanken Sie Sonne statt Super
              </h2>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="pretty mt-6 max-w-lg text-lg leading-relaxed text-gray-500">
                Ihre Wallbox lädt bevorzugt dann, wenn Ihre Anlage überschüssigen Strom produziert – für
                Fahrkilometer, die praktisch nichts kosten.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.16}>
              <div className="mt-10">
                <Button href="#kontakt" variant="primary">
                  Wallbox anfragen
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
