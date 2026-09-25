"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { WhatsAppCheckoutButton } from "@/components/cart/WhatsAppCheckoutButton";
import { cartSubtotal, useCartStore } from "@/lib/cart/store";

export function CartSheet({ whatsappNumber }: { whatsappNumber: string }) {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const subtotal = cartSubtotal(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10" />
            <p>Tu carrito está vacío.</p>
            <Button variant="outline" onClick={close} asChild>
              <Link href="/tienda">Ir a la tienda</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto">
              {items.map((item) => (
                <CartLineItem key={item.lineId} item={item} />
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <CartSummary subtotal={subtotal} />
              <WhatsAppCheckoutButton whatsappNumber={whatsappNumber} />
              <Button variant="ghost" size="sm" asChild onClick={close}>
                <Link href="/carrito">Ver carrito completo</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
