import { defineField, defineType } from "sanity";

/**
 * Reusable object type embedded (not referenced) into any document that
 * has a public URL: siteSettings, product, post.
 */
export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Título (meta)",
      type: "string",
      description: "Si se deja vacío se usa el título del contenido.",
    }),
    defineField({
      name: "metaDescription",
      title: "Descripción (meta)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para redes (Open Graph)",
      type: "image",
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
