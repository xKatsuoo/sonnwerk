import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <section>
        <h2 className="text-ink text-lg font-semibold">Angaben gemäß § 5 TMG</h2>
        <p className="mt-3">
          SONNWERK GmbH
          <br />
          Musterstraße 12
          <br />
          10115 Berlin
          <br />
          Deutschland
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">Kontakt</h2>
        <p className="mt-3">
          Telefon: +49 30 123 456 789
          <br />
          E-Mail: hallo@sonnwerk.de
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">Vertretungsberechtigt</h2>
        <p className="mt-3">Geschäftsführung: M. Sonnwerk</p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">Registereintrag</h2>
        <p className="mt-3">
          Eintragung im Handelsregister.
          <br />
          Registergericht: Amtsgericht Berlin-Charlottenburg
          <br />
          Registernummer: HRB 000000
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">Umsatzsteuer-ID</h2>
        <p className="mt-3">
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE000000000
        </p>
      </section>

      <section>
        <h2 className="text-ink text-lg font-semibold">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <p className="mt-3">
          M. Sonnwerk
          <br />
          Musterstraße 12, 10115 Berlin
        </p>
      </section>
    </LegalPage>
  );
}
