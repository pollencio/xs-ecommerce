"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

export function ProductGallery({
  images,
  productName,
  activeIndex,
  onActiveIndexChange,
}: {
  images: SanityImage[];
  productName: string;
  /** Omit both to let the gallery manage its own selection (default). */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}) {
  const [internalActive, setInternalActive] = useState(0);
  const active = activeIndex ?? internalActive;
  const setActive = onActiveIndexChange ?? setInternalActive;
  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {current ? (
          <Image
            src={urlFor(current).width(800).height(800).url()}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2",
                index === active ? "border-primary" : "border-transparent"
              )}
            >
              <Image
                src={urlFor(image).width(120).height(120).url()}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
