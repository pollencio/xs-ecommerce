import type { Metadata } from "next";

import { PostList } from "@/components/blog/PostList";
import { CategoryList } from "@/components/blog/CategoryList";
import { getBlogCategories, getPosts, getSiteSettings } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Blog",
    description: `Novedades, tips y noticias de ${settings?.storeName || "la tienda"}.`,
    path: "/blog",
    siteName: settings?.storeName,
  });
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getBlogCategories(),
  ]);

  return (
    <div className="container flex flex-col gap-8 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Blog</h1>
        <p className="mt-1 text-muted-foreground">
          Novedades, tips y noticias de la marca.
        </p>
      </div>

      <CategoryList categories={categories} />

      <PostList posts={posts} />
    </div>
  );
}
