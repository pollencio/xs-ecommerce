import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostList } from "@/components/blog/PostList";
import { CategoryList } from "@/components/blog/CategoryList";
import {
  getBlogCategories,
  getBlogCategoryBySlug,
  getPostsByCategory,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [category, settings] = await Promise.all([
    getBlogCategoryBySlug(slug),
    getSiteSettings(),
  ]);

  if (!category) return {};

  return buildMetadata({
    title: category.name,
    description:
      category.description ||
      `Artículos de ${category.name} en el blog de ${settings?.storeName || "la tienda"}.`,
    path: `/blog/categoria/${slug}`,
    siteName: settings?.storeName,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, categories, posts] = await Promise.all([
    getBlogCategoryBySlug(slug),
    getBlogCategories(),
    getPostsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="container flex flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold">{category.name}</h1>
        {category.description ? (
          <p className="mt-1 text-muted-foreground">{category.description}</p>
        ) : null}
      </div>

      <CategoryList categories={categories} activeSlug={slug} />

      <PostList posts={posts} />
    </div>
  );
}
