"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CategoryChips } from "@/components/store/CategoryChips";
import { SortSelect, type SortOption } from "@/components/store/SortSelect";
import type { Category } from "@/lib/sanity/types";

export function ProductFilters({
  categories,
  categoryId,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  inStockOnly,
  onInStockOnlyChange,
}: {
  categories: Category[];
  categoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CategoryChips
        categories={categories}
        value={categoryId}
        onChange={onCategoryChange}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar productos…"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockOnlyChange(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Solo en stock
          </label>

          <SortSelect value={sort} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
