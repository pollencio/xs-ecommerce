import type { MetadataRoute } from "next";

import {
  getBlogCategories,
  getPostSlugs,
  getProductSlugs,
} from "@/lib/sanity/queries";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, blogCategories] = await Promise.all([
    getProductSlugs(),
    getPostSlugs(),
    getBlogCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tienda`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/blog`, changeFrequency: "daily", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map(({ slug }) => ({
    url: `${siteUrl}/tienda/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map(({ slug }) => ({
    url: `${siteUrl}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories.map(
    (category) => ({
      url: `${siteUrl}/blog/categoria/${category.slug.current}`,
      changeFrequency: "weekly",
      priority: 0.5,
    })
  );

  return [...staticRoutes, ...productRoutes, ...postRoutes, ...blogCategoryRoutes];
}
