import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  honeypot?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accepts and validates a contact-form submission. Wire the success branch to an email/CRM provider in production. */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (payload.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const errors: Record<string, string> = {};
  if (!payload.name || payload.name.trim().length < 2) errors.name = "Bitte geben Sie Ihren Namen an.";
  if (!payload.email || !EMAIL_PATTERN.test(payload.email))
    errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (!payload.message || payload.message.trim().length < 10)
    errors.message = "Ihre Nachricht sollte mindestens 10 Zeichen enthalten.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  console.info("[contact] Neue Anfrage eingegangen", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone ?? null,
  });

  return NextResponse.json({ ok: true });
}
