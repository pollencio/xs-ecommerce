"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cartCount, useCartStore } from "@/lib/cart/store";

export function CartButton() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const count = cartCount(items);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={open}
      className="relative"
      aria-label="Abrir carrito"
    >
      <ShoppingBag className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Button>
  );
}
