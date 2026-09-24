import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  // Singleton: the Studio structure (or a document-actions guard) should
  // prevent creating more than one of these.
  fields: [
    defineField({
      name: "storeName",
      title: "Nombre de la tienda",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Descripción corta",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "whatsappNumber",
      title: "Número de WhatsApp",
      description:
        "Incluye el código de país, solo dígitos. Ejemplo: 51987654321",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^[0-9]{8,15}$/, {
          name: "número de WhatsApp",
          invert: false,
        }),
    }),
    defineField({
      name: "contactEmail",
      title: "Correo de contacto",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Redes sociales",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Plataforma",
              type: "string",
              options: {
                list: [
                  "Instagram",
                  "Facebook",
                  "TikTok",
                  "X",
                  "YouTube",
                ],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO por defecto",
      type: "seo",
    }),
  ],
});
