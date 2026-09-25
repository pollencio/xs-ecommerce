import type { Metadata } from "next";

import { urlFor } from "./sanity/image";
import type { SeoFields } from "./sanity/types";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

interface BuildMetadataArgs {
  title: string;
  description?: string;
  seo?: SeoFields;
  path: string;
  fallbackImage?: string;
  siteName?: string;
}

/**
 * Builds a Next.js Metadata object from a Sanity document's fields, with
 * the document's own title/description as the fallback for its `seo`
 * overrides. Used by generateMetadata() in every public route.
 */
export function buildMetadata({
  title,
  description,
  seo,
  path,
  fallbackImage,
  siteName,
}: BuildMetadataArgs): Metadata {
  const resolvedTitle = seo?.metaTitle || title;
  const resolvedDescription = seo?.metaDescription || description;
  const url = `${siteUrl}${path}`;
  const image = seo?.ogImage
    ? urlFor(seo.ogImage).width(1200).height(630).url()
    : fallbackImage;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      locale: "es",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: image ? [image] : undefined,
    },
  };
}

export function organizationJsonLd(args: {
  name: string;
  description?: string;
  logo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: args.name,
    description: args.description,
    url: siteUrl,
    logo: args.logo,
  };
}

export function websiteJsonLd(args: { name: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: args.name,
    url: siteUrl,
  };
}

export function productJsonLd(args: {
  name: string;
  description?: string;
  image?: string;
  price: number;
  priceRange?: { min: number; max: number };
  slug: string;
  inStock: boolean;
}) {
  const url = `${siteUrl}/tienda/${args.slug}`;
  const availability = args.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const offers =
    args.priceRange && args.priceRange.min !== args.priceRange.max
      ? {
          "@type": "AggregateOffer",
          url,
          priceCurrency: "USD",
          lowPrice: args.priceRange.min,
          highPrice: args.priceRange.max,
          availability,
        }
      : {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: args.price,
          availability,
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image,
    offers,
  };
}

export function blogPostingJsonLd(args: {
  title: string;
  description?: string;
  image?: string;
  slug: string;
  publishedAt: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    image: args.image,
    datePublished: args.publishedAt,
    author: args.author ? { "@type": "Person", name: args.author } : undefined,
    mainEntityOfPage: `${siteUrl}/blog/${args.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
