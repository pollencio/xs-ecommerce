"use client";

import { cn } from "@/lib/utils";
import type { ProductColor } from "@/lib/sanity/types";

/**
 * With a hex code: a circle swatch, name shown on hover (title attribute +
 * a CSS tooltip) and via aria-label. Without one: a small pill with the
 * name, since there's nothing to swatch.
 *
 * Passing onSelect makes swatches interactive (product page); omitting it
 * renders plain, non-interactive markup (store cards).
 */
export function ColorSwatches({
  colors,
  selectedKey,
  onSelect,
}: {
  colors: ProductColor[];
  selectedKey?: string;
  onSelect?: (color: ProductColor) => void;
}) {
  if (colors.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((color) => {
        const isSelected = color._key === selectedKey;

        if (!color.hex) {
          return onSelect ? (
            <button
              key={color._key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(color)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:bg-accent"
              )}
            >
              {color.name}
            </button>
          ) : (
            <span
              key={color._key}
              className="rounded-full border border-input bg-background px-2.5 py-1 text-xs text-foreground"
            >
              {color.name}
            </span>
          );
        }

        const swatch = (
          <span
            className="block h-full w-full rounded-full border border-black/10"
            style={{ backgroundColor: color.hex }}
          />
        );
        const tooltip = (
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
            {color.name}
          </span>
        );

        return onSelect ? (
          <button
            key={color._key}
            type="button"
            title={color.name}
            aria-label={color.name}
            aria-pressed={isSelected}
            onClick={() => onSelect(color)}
            className={cn(
              "group relative flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
              isSelected
                ? "ring-2 ring-primary"
                : "hover:ring-2 hover:ring-muted-foreground/40"
            )}
          >
            {swatch}
            {tooltip}
          </button>
        ) : (
          <span
            key={color._key}
            title={color.name}
            aria-label={color.name}
            className="group relative flex h-6 w-6 items-center justify-center rounded-full"
          >
            {swatch}
            {tooltip}
          </span>
        );
      })}
    </div>
  );
}
