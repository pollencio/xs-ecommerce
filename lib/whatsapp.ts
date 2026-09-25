import type { CartItem } from "./cart/store";
import { formatPrice } from "./format";
import { formatVariantLabel } from "./products/variants";

/**
 * There is no payment system: checkout hands the shopper off to WhatsApp
 * with the cart already written out. This is the only integration point
 * for that flow — reused by the cart Sheet, the /carrito page, and the
 * landing contact section.
 */

function normalizePhone(raw: string) {
  return raw.replace(/[^0-9]/g, "");
}

export function buildCheckoutMessage(items: CartItem[], siteUrl?: string) {
  const lines = items.map((item) => {
    const lineTotal = formatPrice(item.price * item.quantity);
    const link = siteUrl ? `${siteUrl}/tienda/${item.slug}` : undefined;
    const variantLabel = formatVariantLabel(item.size, item.color, item.sizeLabel);
    const name = variantLabel ? `${item.name} (${variantLabel})` : item.name;
    return [
      `• ${name} x${item.quantity} — ${lineTotal}`,
      link ? `  ${link}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  });

  const total = formatPrice(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  return [
    "¡Hola! Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Total: ${total}`,
  ].join("\n");
}

export function buildCheckoutUrl(
  items: CartItem[],
  whatsappNumber: string,
  siteUrl?: string
) {
  const message = buildCheckoutMessage(items, siteUrl);
  const phone = normalizePhone(whatsappNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildContactUrl(
  whatsappNumber: string,
  fields: { name: string; message: string }
) {
  const text = [
    "¡Hola! Mi nombre es " + fields.name + ".",
    fields.message,
  ].join("\n\n");
  const phone = normalizePhone(whatsappNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
