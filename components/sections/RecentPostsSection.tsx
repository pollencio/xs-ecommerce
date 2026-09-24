import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PostList } from "@/components/blog/PostList";
import type { Post } from "@/lib/sanity/types";

export function RecentPostsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="container py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Del blog</h2>
          <p className="mt-1 text-muted-foreground">
            Novedades, tips y noticias de la marca.
          </p>
        </div>
        <Button variant="outline" asChild className="hidden sm:inline-flex">
          <Link href="/blog">Ver todos los artículos</Link>
        </Button>
      </div>

      <PostList posts={posts} />

      <div className="mt-8 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/blog">Ver todos los artículos</Link>
        </Button>
      </div>
    </section>
  );
}
