import Link from "next/link";
import Image from "next/image";

import { Nav } from "@/components/layout/Nav";
import { CartButton } from "@/components/layout/CartButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { urlFor } from "@/lib/sanity/image";
import type { SiteSettings } from "@/lib/sanity/types";

export function Header({ settings }: { settings: SiteSettings | null }) {
  const storeName = settings?.storeName || "Tu Tienda";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          {settings?.logo ? (
            <Image
              src={urlFor(settings.logo).width(80).height(80).url()}
              alt={storeName}
              width={32}
              height={32}
              className="rounded-sm"
            />
          ) : null}
          {storeName}
        </Link>

        <Nav className="hidden md:block" />

        <div className="flex items-center gap-2">
          <CartButton />
          <MobileNav storeName={storeName} />
        </div>
      </div>
    </header>
  );
}
