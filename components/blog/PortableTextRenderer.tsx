import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => (
      <span className="relative my-6 block aspect-video overflow-hidden rounded-lg">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ""}
          fill
          className="object-cover"
        />
      </span>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-2xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-display text-xl font-semibold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: unknown[] }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-display">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
