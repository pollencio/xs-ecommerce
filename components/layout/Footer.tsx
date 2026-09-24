import Link from "next/link";

import type { SiteSettings } from "@/lib/sanity/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const storeName = settings?.storeName || "Tu Tienda";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold">{storeName}</p>
          {settings?.description ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {settings.description}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-sm font-semibold">Navegación</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/tienda">Tienda</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/#nosotros">Nosotros</Link></li>
            <li><Link href="/#contacto">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {settings?.contactEmail ? (
              <li>
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {settings?.address ? <li>{settings.address}</li> : null}
            {settings?.socialLinks?.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {year} {storeName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
