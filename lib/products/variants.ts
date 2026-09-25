import type { Product, ProductColor, ProductSize, SanityImage } from "@/lib/sanity/types";

/**
 * Pure helpers for size/color variants, shared by the product page, store
 * cards, the cart, JSON-LD and the WhatsApp message builder — the single
 * place that knows how "selected size + selected color" turns into a
 * price, an image, a cart line id and a human-readable description.
 */

export function sizeLabelOf(product: Pick<Product, "sizeLabel">) {
  return product.sizeLabel?.trim() || "Talla";
}

export function hasVariants(product: Pick<Product, "sizes" | "colors">) {
  return Boolean(product.sizes?.length || product.colors?.length);
}

export function effectivePrice(
  product: Pick<Product, "price">,
  size?: ProductSize
) {
  return typeof size?.price === "number" ? size.price : product.price;
}

export function priceRange(product: Pick<Product, "price" | "sizes">) {
  const prices = [
    product.price,
    ...(product.sizes ?? [])
      .map((size) => size.price)
      .filter((price): price is number => typeof price === "number"),
  ];
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function hasVaryingPrice(product: Pick<Product, "price" | "sizes">) {
  const { min, max } = priceRange(product);
  return min !== max;
}

function imageKey(image: SanityImage) {
  return image.asset?._ref;
}

/**
 * Product images first, then size images, then color images — each only
 * once, in case the same image was reused across a size and a color.
 */
export function galleryImages(
  product: Pick<Product, "images" | "sizes" | "colors">
): SanityImage[] {
  const images: SanityImage[] = [...(product.images ?? [])];
  const seen = new Set(images.map(imageKey));

  for (const size of product.sizes ?? []) {
    const key = size.image && imageKey(size.image);
    if (size.image && key && !seen.has(key)) {
      images.push(size.image);
      seen.add(key);
    }
  }
  for (const color of product.colors ?? []) {
    const key = color.image && imageKey(color.image);
    if (color.image && key && !seen.has(key)) {
      images.push(color.image);
      seen.add(key);
    }
  }
  return images;
}

/** Color's own look takes priority over the size's, for a cart thumbnail. */
export function variantImage(size?: ProductSize, color?: ProductColor) {
  return color?.image ?? size?.image;
}

/** Where `image` lands in `images` (by asset ref), for jumping the gallery to it. */
export function indexOfImage(
  images: SanityImage[],
  image?: SanityImage
): number | undefined {
  if (!image) return undefined;
  const key = imageKey(image);
  if (!key) return undefined;
  const index = images.findIndex((candidate) => imageKey(candidate) === key);
  return index >= 0 ? index : undefined;
}

export function buildLineId(
  productId: string,
  size?: ProductSize,
  color?: ProductColor
) {
  return [productId, size?._key ?? "", color?._key ?? ""].join("|");
}

/** e.g. "Talla M, Color Azul" — used in the cart and the WhatsApp message. */
export function variantDescription(
  product: Pick<Product, "sizeLabel">,
  size?: ProductSize,
  color?: ProductColor
): string | undefined {
  return formatVariantLabel(size?.name, color?.name, sizeLabelOf(product));
}

/**
 * Same formatting as variantDescription(), but from the flat strings a
 * CartItem stores — the cart no longer has the full Product/ProductSize
 * objects to read from once an item's been added.
 */
export function formatVariantLabel(
  size?: string,
  color?: string,
  sizeLabel?: string
): string | undefined {
  const parts: string[] = [];
  if (size) parts.push(`${sizeLabel || "Talla"} ${size}`);
  if (color) parts.push(`Color ${color}`);
  return parts.length > 0 ? parts.join(", ") : undefined;
}
