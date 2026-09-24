import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/store/ProductGrid";
import type { Product } from "@/lib/sanity/types";

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section id="destacados" className="container py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Destacados</h2>
          <p className="mt-1 text-muted-foreground">
            Una selección de lo mejor de nuestra tienda.
          </p>
        </div>
        <Button variant="outline" asChild className="hidden sm:inline-flex">
          <Link href="/tienda">Ver toda la tienda</Link>
        </Button>
      </div>

      <ProductGrid products={products} />

      <div className="mt-8 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/tienda">Ver toda la tienda</Link>
        </Button>
      </div>
    </section>
  );
}
