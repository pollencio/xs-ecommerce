import { sanityClient } from "./client";
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(
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
    { next: { revalidate: 60 } }
  );
}

export async function getLandingPage(): Promise<LandingPage | null> {
  return sanityClient.fetch(
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
    { next: { revalidate: 60 } }
  );
}

export async function getActivePromoBanner(): Promise<PromoBanner | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "promoBanner" && active == true] | order(_createdAt desc)[0]{
      _id, title, subtitle, image, ctaLabel, ctaHref, active
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "category"] | order(name asc){
      _id, name, slug, image
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "category" && slug.current == $slug][0]{
      _id, name, slug, image
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getProducts(): Promise<Product[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "product"] | order(_createdAt desc){
      ${productFragment}
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "product" && featured == true] | order(_createdAt desc)[0...$limit]{
      ${productFragment}
    }`,
    { limit },
    { next: { revalidate: 60 } }
  );
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "product" && slug.current == $slug][0]{
      ${productFragment}
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getProductSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "blogCategory"] | order(name asc){
      _id, name, slug, description
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getPosts(): Promise<Post[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post"] | order(publishedAt desc){
      ${postFragment}
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post"] | order(publishedAt desc)[0...$limit]{
      ${postFragment}
    }`,
    { limit },
    { next: { revalidate: 60 } }
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && slug.current == $slug][0]{
      ${postFragment}
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getPostsByCategory(
  categorySlug: string
): Promise<Post[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc){
      ${postFragment}
    }`,
    { categorySlug },
    { next: { revalidate: 60 } }
  );
}
