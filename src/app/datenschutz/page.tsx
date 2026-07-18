import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <section>
        <h2 className="text-ink text-lg font-semibold">1. Verantwortlicher</h2>
        <p className="mt-3">
          Verantwortlich für die Datenverarbeitung auf dieser Website ist die SONNWERK GmbH, Musterstraße 12,
          10115 Berlin, hallo@sonnwerk.de.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">2. Erhebung und Verarbeitung von Daten</h2>
        <p className="mt-3">
          Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen angegebenen Daten (Name,
          E-Mail-Adresse, optional Telefonnummer, Ihre Nachricht) ausschließlich zur Bearbeitung Ihrer
          Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">3. Speicherdauer</h2>
        <p className="mt-3">
          Ihre Daten werden gelöscht, sobald sie für die Bearbeitung Ihrer Anfrage nicht mehr erforderlich
          sind, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">4. Ihre Rechte</h2>
        <p className="mt-3">
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
          Verarbeitung Ihrer personenbezogenen Daten sowie ein Recht auf Datenübertragbarkeit und Widerspruch.
          Wenden Sie sich hierzu an hallo@sonnwerk.de.
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">5. Hosting</h2>
        <p className="mt-3">
          Diese Website wird bei einem Hosting-Anbieter innerhalb der Europäischen Union betrieben. Beim
          Aufruf der Website werden automatisch technische Zugriffsdaten (Server-Logfiles) erfasst, die für
          den technischen Betrieb erforderlich sind.
        </p>
      </section>
    </LegalPage>
  );
}
