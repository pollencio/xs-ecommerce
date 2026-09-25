/**
 * Hand-written types mirroring the schemas in sanity/schemas/. Kept here
 * (rather than depending on the `sanity` package) so the storefront has
 * zero dependency on the Studio — only on the shape of the data it reads.
 */

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
}

export interface Slug {
  current: string;
}

export interface SiteSettings {
  storeName: string;
  logo?: SanityImage;
  description?: string;
  whatsappNumber: string;
  contactEmail?: string;
  address?: string;
  socialLinks?: { platform: string; url: string }[];
  seo?: SeoFields;
}

export interface LandingPage {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  aboutTitle: string;
  aboutBody?: unknown[]; // Portable Text
  aboutImage?: SanityImage;
  contactTitle?: string;
  contactBody?: string;
}

export interface PromoBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image?: SanityImage;
  ctaLabel?: string;
  ctaHref?: string;
  active: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: Slug;
  image?: SanityImage;
}

export interface ProductSize {
  _key: string;
  name: string;
  price?: number;
  image?: SanityImage;
}

export interface ProductColor {
  _key: string;
  name: string;
  hex?: string;
  image?: SanityImage;
}

export interface Product {
  _id: string;
  name: string;
  slug: Slug;
  images: SanityImage[];
  price: number;
  compareAtPrice?: number;
  description?: unknown[]; // Portable Text
  category?: Category;
  tags?: string[];
  featured?: boolean;
  inStock: boolean;
  seo?: SeoFields;
  _createdAt: string;
  sizeLabel?: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
}

export interface BlogCategory {
  _id: string;
  name: string;
  slug: Slug;
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: SanityImage;
  body?: unknown[]; // Portable Text
  category?: BlogCategory;
  author?: string;
  publishedAt: string;
  seo?: SeoFields;
}
