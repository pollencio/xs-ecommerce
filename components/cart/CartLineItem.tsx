"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { formatVariantLabel } from "@/lib/products/variants";

export function CartLineItem({ item }: { item: CartItem }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const variantLabel = formatVariantLabel(item.size, item.color, item.sizeLabel);

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{item.name}</p>
          <button
            type="button"
            onClick={() => remove(item.lineId)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Quitar ${item.name} del carrito`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {variantLabel ? (
          <p className="text-xs text-muted-foreground">{variantLabel}</p>
        ) : null}

        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setQuantity(item.lineId, item.quantity - 1)}
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setQuantity(item.lineId, item.quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
