"use client";

import { ShoppingBag } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import type { Product, ProductColor, ProductSize } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";
import {
  buildLineId,
  effectivePrice,
  sizeLabelOf,
  variantImage,
} from "@/lib/products/variants";

export function AddToCartButton({
  product,
  selectedSize,
  selectedColor,
  quantity = 1,
  ...buttonProps
}: {
  product: Product;
  selectedSize?: ProductSize;
  selectedColor?: ProductColor;
  quantity?: number;
} & Omit<ButtonProps, "onClick">) {
  const add = useCartStore((s) => s.add);

  const image = variantImage(selectedSize, selectedColor) ?? product.images?.[0];

  return (
    <Button
      disabled={!product.inStock}
      onClick={() =>
        add(
          {
            lineId: buildLineId(product._id, selectedSize, selectedColor),
            productId: product._id,
            slug: product.slug.current,
            name: product.name,
            price: effectivePrice(product, selectedSize),
            image: image
              ? urlFor(image).width(200).height(200).url()
              : undefined,
            size: selectedSize?.name,
            color: selectedColor?.name,
            sizeLabel: selectedSize ? sizeLabelOf(product) : undefined,
          },
          quantity
        )
      }
      {...buttonProps}
    >
      <ShoppingBag className="h-4 w-4" />
      {product.inStock ? "Agregar al carrito" : "Agotado"}
    </Button>
  );
}
