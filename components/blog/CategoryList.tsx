import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { BlogCategory } from "@/lib/sanity/types";

export function CategoryList({
  categories,
  activeSlug,
}: {
  categories: BlogCategory[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link key={category._id} href={`/blog/categoria/${category.slug.current}`}>
          <Badge variant={activeSlug === category.slug.current ? "default" : "secondary"}>
            {category.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
