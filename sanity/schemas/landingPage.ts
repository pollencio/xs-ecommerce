import { defineField, defineType } from "sanity";

export default defineType({
  name: "landingPage",
  title: "Página de inicio",
  type: "document",
  // Singleton.
  groups: [
    { name: "hero", title: "Portada" },
    { name: "about", title: "Nosotros" },
    { name: "contact", title: "Contacto" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Título",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Texto del botón",
      type: "string",
      group: "hero",
      initialValue: "Ver tienda",
    }),
    defineField({
      name: "heroCtaHref",
      title: "Enlace del botón",
      type: "string",
      group: "hero",
      initialValue: "/tienda",
    }),
    defineField({
      name: "aboutTitle",
      title: "Título",
      type: "string",
      group: "about",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutBody",
      title: "Contenido",
      type: "array",
      of: [{ type: "block" }],
      group: "about",
    }),
    defineField({
      name: "aboutImage",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      group: "about",
    }),
    defineField({
      name: "contactTitle",
      title: "Título",
      type: "string",
      group: "contact",
      initialValue: "Contáctanos",
    }),
    defineField({
      name: "contactBody",
      title: "Texto",
      type: "text",
      rows: 3,
      group: "contact",
    }),
  ],
});
