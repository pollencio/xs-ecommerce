"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  /** Unique per product+size+color combination — see buildLineId(). */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  /** e.g. "Talla" — carried along so the cart/checkout message can label `size` correctly. */
  sizeLabel?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
}

interface PersistedCartV0 {
  items?: Array<Partial<CartItem> & { productId: string }>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.lineId === item.lineId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.lineId === item.lineId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
        set({ isOpen: true });
      },
      remove: (lineId) =>
        set({ items: get().items.filter((i) => i.lineId !== lineId) }),
      setQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().remove(lineId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.lineId === lineId ? { ...i, quantity } : i
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "xs-ecommerce-cart",
      version: 1,
      // Carts saved before variants existed have no `lineId` — they were
      // keyed by productId alone, so that's a safe, unique stand-in.
      migrate: (persistedState, version) => {
        if (version >= 1) return persistedState as CartState;
        const { items = [] } = persistedState as PersistedCartV0;
        return {
          items: items.map((item) => ({
            ...item,
            lineId: item.lineId ?? item.productId,
          })),
        } as CartState;
      },
    }
  )
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
