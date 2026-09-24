import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { Badge } from "@/components/ui/badge";
import {
  getPostBySlug,
  getPostSlugs,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatDate } from "@/lib/format";
import { blogPostingJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) return {};

  const image = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return buildMetadata({
    title: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    seo: post.seo,
    path: `/blog/${slug}`,
    fallbackImage: image,
    siteName: settings?.storeName,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const jsonLdImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return (
    <article className="container max-w-3xl py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingJsonLd({
              title: post.title,
              description: post.seo?.metaDescription || post.excerpt,
              image: jsonLdImage,
              slug: post.slug.current,
              publishedAt: post.publishedAt,
              author: post.author,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug.current}` },
            ])
          ),
        }}
      />

      {post.category ? (
        <Badge variant="secondary" className="mb-4">
          {post.category.name}
        </Badge>
      ) : null}

      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span>{formatDate(post.publishedAt)}</span>
        {post.author ? <span>· {post.author}</span> : null}
      </div>

      {post.mainImage ? (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {post.body ? (
        <div className="mt-8">
          <PortableTextRenderer value={post.body} />
        </div>
      ) : null}
    </article>
  );
}
