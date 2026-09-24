"use client";

import { useState } from "react";
import { MessageCircle, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { buildContactUrl } from "@/lib/whatsapp";
import type { LandingPage, SiteSettings } from "@/lib/sanity/types";

/**
 * There is no backend for this form — with no payments and no DB, the
 * simplest path is composing the message and handing off to WhatsApp
 * (or a mailto:, if no WhatsApp number is configured), same as checkout.
 */
export function ContactSection({
  landing,
  settings,
}: {
  landing: LandingPage | null;
  settings: SiteSettings | null;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = settings?.whatsappNumber;
  const title = landing?.contactTitle || "Contáctanos";
  const body =
    landing?.contactBody ||
    "¿Tienes una pregunta? Escríbenos y te respondemos a la brevedad.";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    if (whatsappNumber) {
      const url = buildContactUrl(whatsappNumber, { name, message });
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (settings?.contactEmail) {
      const subject = encodeURIComponent(`Mensaje de ${name}`);
      const bodyText = encodeURIComponent(message);
      window.location.href = `mailto:${settings.contactEmail}?subject=${subject}&body=${bodyText}`;
    }
  }

  return (
    <section id="contacto" className="bg-secondary/40 py-16">
      <div className="container grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          <p className="mt-2 max-w-md text-muted-foreground">{body}</p>

          <div className="mt-6 flex flex-col gap-3 text-sm">
            {settings?.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> {settings.contactEmail}
              </a>
            ) : null}
            {settings?.address ? (
              <span className="flex items-center gap-2 text-foreground/80">
                <MapPin className="h-4 w-4" /> {settings.address}
              </span>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-name">Nombre</Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-message">Mensaje</Label>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="¿En qué te podemos ayudar?"
              required
            />
          </div>

          <Button type="submit" size="lg" className="mt-2">
            <MessageCircle className="h-4 w-4" />
            Enviar mensaje
          </Button>
        </form>
      </div>
    </section>
  );
}
