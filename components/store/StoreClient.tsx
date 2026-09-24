"use client";

import { useMemo, useState } from "react";

import { ProductFilters } from "@/components/store/ProductFilters";
import { ProductGrid } from "@/components/store/ProductGrid";
import type { SortOption } from "@/components/store/SortSelect";
import type { Category, Product } from "@/lib/sanity/types";

/**
 * The initial product list is fetched server-side (for SEO — crawlers see
 * the full grid without JS). Filtering and sorting then happen client-side
 * over that same list, which keeps the store fast and simple for a small
 * catalog without round-tripping to the CMS on every interaction.
 */
export function StoreClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = products;

    if (categoryId) {
      result = result.filter((p) => p.category?._id === categoryId);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return (
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
          );
      }
    });

    return result;
  }, [products, categoryId, inStockOnly, search, sort]);

  return (
    <div className="flex flex-col gap-6">
      <ProductFilters
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={setInStockOnly}
      />

      <ProductGrid products={filtered} />
    </div>
  );
}
