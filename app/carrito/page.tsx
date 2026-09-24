import type { Metadata } from "next";

import { CartPageClient } from "@/components/cart/CartPageClient";
import { getSiteSettings } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Carrito",
    description: "Revisa tu carrito y finaliza tu pedido por WhatsApp.",
    path: "/carrito",
    siteName: settings?.storeName,
  });
}

export default async function CartPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Tu carrito</h1>
      <div className="mt-8">
        <CartPageClient whatsappNumber={settings?.whatsappNumber || ""} />
      </div>
    </div>
  );
}
