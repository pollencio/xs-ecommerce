"use client";

import { useMemo, useState } from "react";

import { ProductGallery } from "@/components/store/ProductGallery";
import { SizeSelector } from "@/components/store/SizeSelector";
import { ColorSwatches } from "@/components/store/ColorSwatches";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/sanity/types";
import {
  effectivePrice,
  galleryImages,
  indexOfImage,
  sizeLabelOf,
} from "@/lib/products/variants";

/**
 * Owns the size/color selection and the gallery's active image together —
 * selecting a variant with its own image jumps the gallery to it, and the
 * price/add-to-cart state depend on the same selection. Everything else
 * about the product (metadata, JSON-LD, static params) stays server-side
 * in app/tienda/[slug]/page.tsx; this only needs the product data.
 */
export function ProductPurchase({ product }: { product: Product }) {
  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];
  const images = useMemo(() => galleryImages(product), [product]);

  // Exactly one option on an axis isn't a real choice — pick it for the
  // shopper. Otherwise, the axis starts unselected until they choose.
  const [selectedSizeKey, setSelectedSizeKey] = useState(
    sizes.length === 1 ? sizes[0]._key : undefined
  );
  const [selectedColorKey, setSelectedColorKey] = useState(
    colors.length === 1 ? colors[0]._key : undefined
  );
  const [activeIndex, setActiveIndex] = useState(() => {
    const autoSize = sizes.length === 1 ? sizes[0] : undefined;
    const autoColor = colors.length === 1 ? colors[0] : undefined;
    return (
      indexOfImage(images, autoColor?.image) ??
      indexOfImage(images, autoSize?.image) ??
      0
    );
  });

  const selectedSize = sizes.find((size) => size._key === selectedSizeKey);
  const selectedColor = colors.find((color) => color._key === selectedColorKey);

  function selectSize(size: (typeof sizes)[number]) {
    setSelectedSizeKey(size._key);
    const index = indexOfImage(images, size.image);
    if (index !== undefined) setActiveIndex(index);
  }

  function selectColor(color: (typeof colors)[number]) {
    setSelectedColorKey(color._key);
    const index = indexOfImage(images, color.image);
    if (index !== undefined) setActiveIndex(index);
  }

  const price = effectivePrice(product, selectedSize);
  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > price;

  const needsSize = sizes.length > 0 && !selectedSizeKey;
  const needsColor = colors.length > 0 && !selectedColorKey;
  const addLabel = needsSize
    ? `Elige ${sizeLabelOf(product).toLowerCase()}`
    : needsColor
      ? "Elige color"
      : null;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductGallery
        images={images}
        productName={product.name}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />

      <div className="flex flex-col gap-4">
        {product.category ? (
          <p className="text-sm text-muted-foreground">{product.category.name}</p>
        ) : null}

        <h1 className="font-display text-3xl font-bold">{product.name}</h1>

        <div className="flex items-center gap-3">
          {!product.inStock ? <Badge variant="secondary">Agotado</Badge> : null}
          {hasDiscount ? <Badge variant="destructive">Oferta</Badge> : null}
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold">{formatPrice(price)}</span>
          {hasDiscount ? (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          ) : null}
        </div>

        {sizes.length > 0 ? (
          <SizeSelector
            label={sizeLabelOf(product)}
            sizes={sizes}
            selectedKey={selectedSizeKey}
            onSelect={selectSize}
          />
        ) : null}

        {colors.length > 0 ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Color</span>
            <ColorSwatches
              colors={colors}
              selectedKey={selectedColorKey}
              onSelect={selectColor}
            />
          </div>
        ) : null}

        {addLabel ? (
          <Button size="lg" className="mt-2 w-full sm:w-auto" disabled>
            {addLabel}
          </Button>
        ) : (
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            size="lg"
            className="mt-2 w-full sm:w-auto"
          />
        )}

        {product.description ? (
          <div className="mt-4">
            <PortableTextRenderer value={product.description} />
          </div>
        ) : null}

        {product.tags && product.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
