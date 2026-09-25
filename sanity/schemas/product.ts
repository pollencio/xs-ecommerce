import { defineField, defineType } from "sanity";

function hasDuplicateNames(items: { name?: string }[] | undefined) {
  if (!items || items.length === 0) return false;
  const names = items
    .map((item) => item.name?.trim().toLowerCase())
    .filter((name): name is string => Boolean(name));
  return new Set(names).size !== names.length;
}

export default defineType({
  name: "product",
  title: "Producto",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "variants", title: "Variantes" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      group: "general",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Precio",
      description:
        "Precio base. Si el producto tiene tallas con precio propio, ese precio reemplaza a este al elegir esa talla.",
      type: "number",
      group: "general",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Precio anterior (tachado)",
      description: "Opcional. Para mostrar un descuento.",
      type: "number",
      group: "general",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "array",
      of: [{ type: "block" }],
      group: "general",
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      group: "general",
    }),
    defineField({
      name: "tags",
      title: "Etiquetas",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "general",
    }),
    defineField({
      name: "featured",
      title: "Destacado",
      description: "Se muestra en la sección de destacados de la portada.",
      type: "boolean",
      initialValue: false,
      group: "general",
    }),
    defineField({
      name: "inStock",
      title: "En stock",
      type: "boolean",
      initialValue: true,
      group: "general",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "general",
    }),
    defineField({
      name: "sizeLabel",
      title: "Etiqueta de talla",
      description:
        'Cómo llamar a esta variante en la tienda. Vacío = "Talla". Útil para otros usos: "Tamaño", "Presentación" (250 ml, 500 ml), etc.',
      type: "string",
      group: "variants",
    }),
    defineField({
      name: "sizes",
      title: "Tallas",
      description:
        "Opcional. Ej: S, M, L — o 250 ml, 500 ml si el producto se vende por presentación.",
      type: "array",
      group: "variants",
      of: [
        {
          type: "object",
          name: "productSize",
          title: "Talla",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Precio propio",
              description:
                "Opcional. Si se define, reemplaza el precio base del producto al elegir esta talla.",
              type: "number",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "image",
              title: "Imagen",
              description: "Opcional. Se agrega a la galería del producto.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", price: "price", media: "image" },
            prepare({ title, price, media }) {
              return {
                title,
                subtitle: typeof price === "number" ? `$${price}` : undefined,
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((sizes) =>
          hasDuplicateNames(sizes as { name?: string }[] | undefined)
            ? "Los nombres de talla deben ser únicos."
            : true
        ),
    }),
    defineField({
      name: "colors",
      title: "Colores",
      description: "Opcional.",
      type: "array",
      group: "variants",
      of: [
        {
          type: "object",
          name: "productColor",
          title: "Color",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "color",
              title: "Color",
              description:
                "Opcional. Si no se define, en la tienda se muestra solo el nombre.",
              type: "color",
              options: { disableAlpha: true },
            }),
            defineField({
              name: "image",
              title: "Imagen",
              description: "Opcional. Se agrega a la galería del producto.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", hex: "color.hex", media: "image" },
            prepare({ title, hex, media }) {
              return { title, subtitle: hex, media };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((colors) =>
          hasDuplicateNames(colors as { name?: string }[] | undefined)
            ? "Los nombres de color deben ser únicos."
            : true
        ),
    }),
  ],
  preview: {
    select: { title: "name", media: "images.0", price: "price" },
    prepare({ title, media, price }) {
      return { title, subtitle: price ? `$${price}` : undefined, media };
    },
  },
});
