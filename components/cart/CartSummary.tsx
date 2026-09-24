import { formatPrice } from "@/lib/format";

export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-4 text-base font-semibold">
      <span>Total</span>
      <span>{formatPrice(subtotal)}</span>
    </div>
  );
}
