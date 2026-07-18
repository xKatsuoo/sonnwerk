"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

type Status = "idle" | "loading" | "success" | "error";

const contactDetails = [
  { label: "Telefon", value: "+49 30 123 456 789", href: "tel:+4930123456789" },
  { label: "E-Mail", value: "hallo@sonnwerk.de", href: "mailto:hallo@sonnwerk.de" },
  { label: "Adresse", value: "Musterstraße 12, 10115 Berlin" },
];

/** Contact form backed by /api/contact, with client-side validation and inline field errors. */
export function Kontakt() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});

    // The native event's `currentTarget` is cleared once dispatch finishes, so it must
    // be captured now — using it after the `await` below would read back as null.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      honeypot: String(formData.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="kontakt" className="bg-anthracite py-28 text-white sm:py-36">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              kicker="Kontakt"
              title="Starten Sie Ihre kostenlose Beratung"
              description="Sagen Sie uns, wie wir Sie erreichen können. Wir melden uns innerhalb eines Werktages."
              tone="dark"
            />

            <dl className="mt-12 space-y-6">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-baseline gap-4">
                  <dt className="w-20 shrink-0 text-sm text-gray-500">{item.label}</dt>
                  <dd>
                    {item.href ? (
                      <a href={item.href} className="hover:text-solar-blue-light text-base text-gray-200">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-base text-gray-200">{item.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal variant="up">
            {status === "success" ? (
              <div className="bg-anthracite-soft rounded-3xl border border-white/10 p-10">
                <p className="text-xl font-semibold tracking-tight">Vielen Dank für Ihre Anfrage.</p>
                <p className="mt-3 text-gray-400">
                  Wir haben Ihre Nachricht erhalten und melden uns innerhalb eines Werktages bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-gray-400">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="focus:border-solar-blue w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-gray-600"
                    placeholder="Ihr vollständiger Name"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-sm text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-gray-400">
                      E-Mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="focus:border-solar-blue w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-gray-600"
                      placeholder="name@beispiel.de"
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-sm text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm text-gray-400">
                      Telefon (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="focus:border-solar-blue w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-gray-600"
                      placeholder="+49 ..."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-gray-400">
                    Nachricht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="focus:border-solar-blue w-full resize-none rounded-xl border border-white/15 bg-transparent px-4 py-3 text-white placeholder:text-gray-600"
                    placeholder="Erzählen Sie uns kurz von Ihrem Dach und Ihren Zielen."
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-red-400">
                      {errors.message}
                    </p>
                  )}
                </div>

                {status === "error" && Object.keys(errors).length === 0 && (
                  <p className="text-sm text-red-400">
                    Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-solar-blue inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                >
                  {status === "loading" ? "Wird gesendet…" : "Anfrage senden"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
