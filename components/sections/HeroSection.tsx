import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { LandingPage } from "@/lib/sanity/types";

export function HeroSection({ landing }: { landing: LandingPage | null }) {
  const title = landing?.heroTitle || "Productos que enamoran, hechos para ti";
  const subtitle =
    landing?.heroSubtitle ||
    "Descubre nuestra colección y haz tu pedido en minutos, directo por WhatsApp.";
  const ctaLabel = landing?.heroCtaLabel || "Ver tienda";
  const ctaHref = landing?.heroCtaHref || "/tienda";

  return (
    <section id="inicio" className="relative overflow-hidden">
      {landing?.heroImage ? (
        <>
          <Image
            src={urlFor(landing.heroImage).width(1920).height(800).url()}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary to-background" />
      )}

      <div className="container relative flex min-h-[60vh] flex-col items-start justify-center gap-4 py-24">
        <h1
          className={`max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl ${
            landing?.heroImage ? "text-white" : "text-foreground"
          }`}
        >
          {title}
        </h1>
        <p
          className={`max-w-xl text-lg ${
            landing?.heroImage ? "text-white/90" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
