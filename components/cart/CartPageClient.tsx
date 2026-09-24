"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { WhatsAppCheckoutButton } from "@/components/cart/WhatsAppCheckoutButton";
import { cartSubtotal, useCartStore } from "@/lib/cart/store";

export function CartPageClient({ whatsappNumber }: { whatsappNumber: string }) {
  const items = useCartStore((s) => s.items);
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center text-muted-foreground">
        <ShoppingBag className="h-12 w-12" />
        <p>Tu carrito está vacío.</p>
        <Button asChild>
          <Link href="/tienda">Ir a la tienda</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="divide-y divide-border lg:col-span-2">
        {items.map((item) => (
          <CartLineItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="flex h-fit flex-col gap-4 rounded-lg border border-border p-6">
        <CartSummary subtotal={subtotal} />
        <WhatsAppCheckoutButton whatsappNumber={whatsappNumber} className="w-full" />
        <Button variant="outline" asChild>
          <Link href="/tienda">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  );
}
