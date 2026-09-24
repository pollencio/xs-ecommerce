import type { Metadata } from "next";

import { PromoBanner } from "@/components/store/PromoBanner";
import { StoreClient } from "@/components/store/StoreClient";
import {
  getActivePromoBanner,
  getCategories,
  getProducts,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Tienda",
    description: `Explora todos los productos de ${settings?.storeName || "la tienda"}.`,
    path: "/tienda",
    siteName: settings?.storeName,
  });
}

export default async function StorePage() {
  const [banner, categories, products] = await Promise.all([
    getActivePromoBanner(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="container flex flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Tienda</h1>
        <p className="mt-1 text-muted-foreground">
          Encuentra el producto perfecto para ti.
        </p>
      </div>

      {banner ? <PromoBanner banner={banner} /> : null}

      <StoreClient products={products} categories={categories} />
    </div>
  );
}
