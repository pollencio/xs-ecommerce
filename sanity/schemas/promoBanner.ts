import { defineField, defineType } from "sanity";

export default defineType({
  name: "promoBanner",
  title: "Banner promocional",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del botón",
      type: "string",
      initialValue: "Ver más",
    }),
    defineField({
      name: "ctaHref",
      title: "Enlace del botón",
      type: "string",
      initialValue: "/tienda",
    }),
    defineField({
      name: "active",
      title: "Activo",
      description: "Solo se muestra el banner activo más reciente.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", active: "active", media: "image" },
    prepare({ title, active, media }) {
      return {
        title,
        subtitle: active ? "Activo" : "Inactivo",
        media,
      };
    },
  },
});
