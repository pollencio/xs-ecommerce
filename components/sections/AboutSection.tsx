import Image from "next/image";

import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { urlFor } from "@/lib/sanity/image";
import type { LandingPage } from "@/lib/sanity/types";

export function AboutSection({ landing }: { landing: LandingPage | null }) {
  const title = landing?.aboutTitle || "Sobre nosotros";

  return (
    <section id="nosotros" className="container py-16">
      <div className="grid items-center gap-8 md:grid-cols-2">
        {landing?.aboutImage ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={urlFor(landing.aboutImage).width(900).height(675).url()}
              alt={title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div>
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          <div className="mt-4">
            {landing?.aboutBody ? (
              <PortableTextRenderer value={landing.aboutBody} />
            ) : (
              <p className="text-muted-foreground">
                Contamos la historia de la marca aquí: quiénes somos, qué nos
                hace diferentes y por qué nuestros clientes nos eligen.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
