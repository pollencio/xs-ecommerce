import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ColorSwatches } from "@/components/store/ColorSwatches";
import { formatPrice } from "@/lib/format";
import { urlFor } from "@/lib/sanity/image";
import type { Product } from "@/lib/sanity/types";
import { hasVariants, hasVaryingPrice, priceRange } from "@/lib/products/variants";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;
  const variants = hasVariants(product);
  const showFromPrice = hasVaryingPrice(product);
  const displayPrice = showFromPrice ? priceRange(product).min : product.price;

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/tienda/${product.slug.current}`} className="block">
        <div className="relative aspect-square bg-muted">
          {image ? (
            <Image
              src={urlFor(image).width(600).height(600).url()}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform hover:scale-105"
            />
          ) : null}
          {!product.inStock ? (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Agotado
            </Badge>
          ) : null}
          {hasDiscount ? (
            <Badge variant="destructive" className="absolute right-2 top-2">
              Oferta
            </Badge>
          ) : null}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-1 pt-4">
        <Link href={`/tienda/${product.slug.current}`}>
          <h3 className="line-clamp-2 font-medium leading-tight hover:underline">
            {product.name}
          </h3>
        </Link>
        {product.category ? (
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
        ) : null}

        {product.sizes && product.sizes.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {product.sizes.map((size) => size.name).join(" · ")}
          </p>
        ) : null}

        {product.colors && product.colors.length > 0 ? (
          <ColorSwatches colors={product.colors} />
        ) : null}

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold">
            {showFromPrice ? `Desde ${formatPrice(displayPrice)}` : formatPrice(displayPrice)}
          </span>
          {hasDiscount ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          ) : null}
        </div>
      </CardContent>

      <CardFooter>
        {variants ? (
          <Button asChild className="w-full" size="sm" variant="outline">
            <Link href={`/tienda/${product.slug.current}`}>Seleccionar opciones</Link>
          </Button>
        ) : (
          <AddToCartButton product={product} className="w-full" size="sm" />
        )}
      </CardFooter>
    </Card>
  );
}
