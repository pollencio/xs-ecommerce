"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/sanity/types";

export function CategoryChips({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string | null;
  onChange: (categoryId: string | null) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm transition-colors",
          value === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-background hover:bg-accent"
        )}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          onClick={() => onChange(category._id)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            value === category._id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background hover:bg-accent"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
