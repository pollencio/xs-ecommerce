import type { StructureResolver } from "sanity/structure";

/**
 * Pins the two singletons (siteSettings, landingPage) as single editable
 * documents at the top of the desk, and lists everything else normally.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Configuración del sitio")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.listItem()
        .title("Página de inicio")
        .id("landingPage")
        .child(
          S.document().schemaType("landingPage").documentId("landingPage")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && !["siteSettings", "landingPage"].includes(item.getId()!)
      ),
    ]);
