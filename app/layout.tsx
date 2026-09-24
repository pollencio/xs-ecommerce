import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/layout/CartSheet";
import { getSiteSettings } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { buildMetadata, organizationJsonLd, siteUrl } from "@/lib/seo";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const storeName = settings?.storeName || "Tu Tienda";

  return {
    ...buildMetadata({
      title: storeName,
      description: settings?.description,
      seo: settings?.seo,
      path: "/",
      siteName: storeName,
    }),
    metadataBase: new URL(siteUrl),
    title: {
      default: storeName,
      template: `%s · ${storeName}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const storeName = settings?.storeName || "Tu Tienda";
  const whatsappNumber = settings?.whatsappNumber || "";
  const logo = settings?.logo ? urlFor(settings.logo).width(256).url() : undefined;

  return (
    <html lang="es" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              organizationJsonLd({
                name: storeName,
                description: settings?.description,
                logo,
              })
            ),
          }}
        />

        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />

        {whatsappNumber ? <CartSheet whatsappNumber={whatsappNumber} /> : null}
      </body>
    </html>
  );
}
