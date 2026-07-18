import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "AGB",
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <section>
        <h2 className="text-ink text-lg font-semibold">1. Geltungsbereich</h2>
        <p className="mt-3">
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Beratungs-, Planungs- und Montageleistungen
          der SONNWERK GmbH gegenüber Verbrauchern und Unternehmern.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">2. Vertragsschluss</h2>
        <p className="mt-3">
          Ein Vertrag kommt erst mit schriftlicher Auftragsbestätigung durch die SONNWERK GmbH zustande. Die
          kostenlose Erstberatung stellt kein verbindliches Angebot dar.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">3. Leistungsumfang</h2>
        <p className="mt-3">
          Der genaue Leistungsumfang – Planung, Komponenten, Montage und Inbetriebnahme – wird individuell im
          Angebot festgehalten, das jedem Kunden vor Beauftragung vorliegt.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">4. Gewährleistung und Garantie</h2>
        <p className="mt-3">
          Es gelten die gesetzlichen Gewährleistungsrechte. Zusätzlich gewähren wir freiwillige
          Herstellergarantien gemäß den jeweiligen Garantiebedingungen der verbauten Komponenten.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">5. Widerrufsrecht</h2>
        <p className="mt-3">
          Verbrauchern steht bei außerhalb von Geschäftsräumen geschlossenen Verträgen ein gesetzliches
          Widerrufsrecht von 14 Tagen zu. Details erhalten Sie mit Ihrer Auftragsbestätigung.
        </p>
      </section>
    </LegalPage>
  );
}
