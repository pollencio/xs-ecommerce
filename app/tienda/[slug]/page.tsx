import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/store/ProductGallery";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { Badge } from "@/components/ui/badge";
import {
  getProductBySlug,
  getProductSlugs,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/format";
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

  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  const jsonLdImage = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(1200).url()
    : undefined;

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              name: product.name,
              description: product.seo?.metaDescription,
              image: jsonLdImage,
              price: product.price,
              slug: product.slug.current,
              inStock: product.inStock,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Tienda", path: "/tienda" },
              { name: product.name, path: `/tienda/${product.slug.current}` },
            ])
          ),
        }}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-4">
          {product.category ? (
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
          ) : null}

          <h1 className="font-display text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            {!product.inStock ? (
              <Badge variant="secondary">Agotado</Badge>
            ) : null}
            {hasDiscount ? <Badge variant="destructive">Oferta</Badge> : null}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount ? (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}
          </div>

          <AddToCartButton product={product} size="lg" className="mt-2 w-full sm:w-auto" />

          {product.description ? (
            <div className="mt-4">
              <PortableTextRenderer value={product.description} />
            </div>
          ) : null}

          {product.tags && product.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
