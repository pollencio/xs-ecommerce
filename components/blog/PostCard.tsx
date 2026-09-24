import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { urlFor } from "@/lib/sanity/image";
import type { Post } from "@/lib/sanity/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug.current}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video bg-muted">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(600).height(340).url()}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, 90vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <CardContent className="flex flex-col gap-2 pt-4">
          {post.category ? (
            <span className="text-xs font-medium uppercase tracking-wide text-primary">
              {post.category.name}
            </span>
          ) : null}
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight">
            {post.title}
          </h3>
          {post.excerpt ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
