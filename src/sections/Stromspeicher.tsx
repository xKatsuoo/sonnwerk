import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const specs = [
  { label: "Kapazität", value: "5 – 20 kWh" },
  { label: "Wirkungsgrad", value: "97,5 %" },
  { label: "Garantie", value: "10 Jahre" },
  { label: "Erweiterbar", value: "modular" },
];

/** Dark, product-page-style spotlight on the battery storage offering. */
export function Stromspeicher() {
  return (
    <section id="speicher" className="bg-anthracite py-28 text-white sm:py-36">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal variant="fade">
              <span className="text-solar-blue-light mb-4 inline-block text-sm font-medium tracking-wide uppercase">
                Batteriespeicher
              </span>
            </Reveal>
            <Reveal variant="up" delay={0.05}>
              <h2 className="balance text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
                Speichern Sie die Sonne für die Nacht
              </h2>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="pretty mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
                Ein Batteriespeicher erhöht Ihren Eigenverbrauch auf bis zu 80 %. Statt überschüssigen Strom
                günstig einzuspeisen, nutzen Sie ihn dann, wenn Sie ihn wirklich brauchen.
              </p>
            </Reveal>
            <Reveal variant="up" delay={0.16}>
              <div className="mt-10">
                <Button href="#kontakt" variant="ghost">
                  Speicher konfigurieren
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={0.1}>
            <div className="bg-anthracite-soft rounded-3xl border border-white/10 p-10">
              <div className="grid grid-cols-2 gap-8">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-sm text-gray-500">{spec.label}</p>
                    <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 h-px w-full bg-white/10" />
              <p className="mt-6 text-sm leading-relaxed text-gray-500">
                Kompatibel mit allen gängigen Wechselrichtern. Nachrüstbar auf Bestandsanlagen ab Baujahr
                2015.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
