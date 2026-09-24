"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart/store";
import { buildCheckoutUrl } from "@/lib/whatsapp";
import { siteUrl } from "@/lib/seo";

export function WhatsAppCheckoutButton({
  whatsappNumber,
  className,
}: {
  whatsappNumber: string;
  className?: string;
}) {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) return null;

  const href = buildCheckoutUrl(items, whatsappNumber, siteUrl);

  return (
    <Button asChild size="lg" className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        Finalizar por WhatsApp
      </a>
    </Button>
  );
}
