import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { PromoBanner as PromoBannerType } from "@/lib/sanity/types";

export function PromoBanner({ banner }: { banner: PromoBannerType }) {
  const hasImage = Boolean(banner.image);

  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-lg bg-secondary sm:min-h-[280px]">
      {banner.image ? (
        <>
          <Image
            src={urlFor(banner.image).width(1600).height(600).url()}
            alt={banner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : null}

      <div className="relative flex min-h-[220px] flex-col justify-center gap-3 p-8 sm:min-h-[280px] sm:p-12">
        <div className="max-w-md">
          <h2
            className={`font-display text-2xl font-bold sm:text-3xl ${
              hasImage ? "text-white" : "text-foreground"
            }`}
          >
            {banner.title}
          </h2>
          {banner.subtitle ? (
            <p className={`mt-2 ${hasImage ? "text-white/90" : "text-muted-foreground"}`}>
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaLabel && banner.ctaHref ? (
            <Button asChild className="mt-4">
              <Link href={banner.ctaHref}>{banner.ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
