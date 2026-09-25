import { isSanityConfigured, sanityClient } from "./client";
import type {
  BlogCategory,
  Category,
  LandingPage,
  Post,
  Product,
  PromoBanner,
  SiteSettings,
} from "./types";

/**
 * All GROQ lives here. Every page/component gets data through one of
 * these functions instead of calling sanityClient.fetch directly, so a
 * future backend swap (or an added caching layer) only touches this file.
 */

const seoFragment = /* groq */ `
  "seo": {
    "metaTitle": seo.metaTitle,
    "metaDescription": seo.metaDescription,
    "ogImage": seo.ogImage
  }
`;

const productFragment = /* groq */ `
  _id,
  name,
  slug,
  images,
  price,
  compareAtPrice,
  description,
  "category": category->{ _id, name, slug, image },
  tags,
  featured,
  inStock,
  _createdAt,
  sizeLabel,
  sizes[]{ _key, name, price, image },
  colors[]{ _key, name, "hex": color.hex, image },
  ${seoFragment}
`;

const postFragment = /* groq */ `
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  body,
  "category": category->{ _id, name, slug, description },
  author,
  publishedAt,
  ${seoFragment}
`;

/**
 * Wraps every query so a missing/unreachable Sanity project (no project id
 * set yet, a typo, a transient outage) degrades to the fallback instead of
 * crashing the build or a page render — the storefront's fallback copy
 * (baked into the section components) takes over.
 */
async function safeFetch<T>(
  query: string,
  params: Record<string, unknown>,
  options: { next?: { revalidate?: number } } | undefined,
  fallback: T
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    return await sanityClient.fetch<T>(query, params, options);
  } catch (error) {
    console.error(
      "[sanity] query failed:",
      error instanceof Error ? error.message : error
    );
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safeFetch(
    /* groq */ `*[_type == "siteSettings"][0]{
      storeName,
      logo,
      description,
      whatsappNumber,
      contactEmail,
      address,
      socialLinks,
      ${seoFragment}
    }`,
    {},
    { next: { revalidate: 60 } },
    null
  );
}

export async function getLandingPage(): Promise<LandingPage | null> {
  return safeFetch(
    /* groq */ `*[_type == "landingPage"][0]{
      heroTitle,
      heroSubtitle,
      heroImage,
      heroCtaLabel,
      heroCtaHref,
      aboutTitle,
      aboutBody,
      aboutImage,
      contactTitle,
      contactBody
    }`,
    {},
    { next: { revalidate: 60 } },
    null
  );
}

export async function getActivePromoBanner(): Promise<PromoBanner | null> {
  return safeFetch(
    /* groq */ `*[_type == "promoBanner" && active == true] | order(_createdAt desc)[0]{
      _id, title, subtitle, image, ctaLabel, ctaHref, active
    }`,
    {},
    { next: { revalidate: 60 } },
    null
  );
}

export async function getCategories(): Promise<Category[]> {
  return safeFetch(
    /* groq */ `*[_type == "category"] | order(name asc){
      _id, name, slug, image
    }`,
    {},
    { next: { revalidate: 60 } },
    []
  );
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return safeFetch(
    /* groq */ `*[_type == "category" && slug.current == $slug][0]{
      _id, name, slug, image
    }`,
    { slug },
    { next: { revalidate: 60 } },
    null
  );
}

export async function getProducts(): Promise<Product[]> {
  return safeFetch(
    /* groq */ `*[_type == "product"] | order(_createdAt desc){
      ${productFragment}
    }`,
    {},
    { next: { revalidate: 60 } },
    []
  );
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return safeFetch(
    /* groq */ `*[_type == "product" && featured == true] | order(_createdAt desc)[0...$limit]{
      ${productFragment}
    }`,
    { limit },
    { next: { revalidate: 60 } },
    []
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  return safeFetch(
    /* groq */ `*[_type == "product" && slug.current == $slug][0]{
      ${productFragment}
    }`,
    { slug },
    { next: { revalidate: 60 } },
    null
  );
}

export async function getProductSlugs(): Promise<{ slug: string }[]> {
  return safeFetch(
    /* groq */ `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`,
    {},
    undefined,
    []
  );
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return safeFetch(
    /* groq */ `*[_type == "blogCategory"] | order(name asc){
      _id, name, slug, description
    }`,
    {},
    { next: { revalidate: 60 } },
    []
  );
}

export async function getPosts(): Promise<Post[]> {
  return safeFetch(
    /* groq */ `*[_type == "post"] | order(publishedAt desc){
      ${postFragment}
    }`,
    {},
    { next: { revalidate: 60 } },
    []
  );
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  return safeFetch(
    /* groq */ `*[_type == "post"] | order(publishedAt desc)[0...$limit]{
      ${postFragment}
    }`,
    { limit },
    { next: { revalidate: 60 } },
    []
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return safeFetch(
    /* groq */ `*[_type == "post" && slug.current == $slug][0]{
      ${postFragment}
    }`,
    { slug },
    { next: { revalidate: 60 } },
    null
  );
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  return safeFetch(
    /* groq */ `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
    {},
    undefined,
    []
  );
}

export async function getBlogCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  return safeFetch(
    /* groq */ `*[_type == "blogCategory" && slug.current == $slug][0]{
      _id, name, slug, description
    }`,
    { slug },
    { next: { revalidate: 60 } },
    null
  );
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<Post[]> {
  return safeFetch(
    /* groq */ `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc){
      ${postFragment}
    }`,
    { categorySlug },
    { next: { revalidate: 60 } },
    []
  );
}
