"use client";

import { cn } from "@/lib/utils";
import type { ProductSize } from "@/lib/sanity/types";

export function SizeSelector({
  label,
  sizes,
  selectedKey,
  onSelect,
}: {
  label: string;
  sizes: ProductSize[];
  selectedKey?: string;
  onSelect: (size: ProductSize) => void;
}) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size._key === selectedKey;
          return (
            <button
              key={size._key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(size)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              {size.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
