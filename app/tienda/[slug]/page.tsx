import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPurchase } from "@/components/store/ProductPurchase";
import {
  getProductBySlug,
  getProductSlugs,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/format";
import { priceRange } from "@/lib/products/variants";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) return {};

  const image = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(1200).url()
    : undefined;

  return buildMetadata({
    title: product.name,
    description:
      product.seo?.metaDescription ||
      `${product.name} — ${formatPrice(product.price)}. Disponible en ${
        settings?.storeName || "la tienda"
      }.`,
    seo: product.seo,
    path: `/tienda/${slug}`,
    fallbackImage: image,
    siteName: settings?.storeName,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const jsonLdImage = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(1200).url()
    : undefined;

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              name: product.name,
              description: product.seo?.metaDescription,
              image: jsonLdImage,
              price: product.price,
              priceRange: priceRange(product),
              slug: product.slug.current,
              inStock: product.inStock,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Tienda", path: "/tienda" },
              { name: product.name, path: `/tienda/${product.slug.current}` },
            ])
          ),
        }}
      />

      <ProductPurchase product={product} />
    </div>
  );
}
