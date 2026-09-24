"use client";

import { ShoppingBag } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import type { Product } from "@/lib/sanity/types";
import { urlFor } from "@/lib/sanity/image";

export function AddToCartButton({
  product,
  quantity = 1,
  ...buttonProps
}: {
  product: Product;
  quantity?: number;
} & Omit<ButtonProps, "onClick">) {
  const add = useCartStore((s) => s.add);

  return (
    <Button
      disabled={!product.inStock}
      onClick={() =>
        add(
          {
            productId: product._id,
            slug: product.slug.current,
            name: product.name,
            price: product.price,
            image: product.images?.[0]
              ? urlFor(product.images[0]).width(200).height(200).url()
              : undefined,
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
