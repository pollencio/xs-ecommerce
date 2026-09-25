# xs-ecommerce

Boilerplate para tiendas online pequeñas: **Next.js + Sanity + checkout por WhatsApp**,
sin base de datos ni pasarela de pagos. Pensado para lanzar tiendas de bajo costo y
bajo mantenimiento operativo para clientes que recién empiezan.

- Todo el contenido (productos, banner, landing, blog) se administra en **Sanity**.
- No hay pagos: el checkout redirige al comprador a un chat de **WhatsApp** con el
  pedido ya escrito.
- No hay backend propio: sin Supabase, sin base de datos. El carrito vive en el
  navegador (`localStorage`).
- SEO de fábrica: metadata por ruta, JSON-LD, sitemap y robots dinámicos.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript) — desplegado en [Vercel](https://vercel.com).
- [Tailwind CSS](https://tailwindcss.com) + componentes propios estilo [shadcn/ui](https://ui.shadcn.com) (viven en el repo, no son una dependencia externa).
- [Sanity](https://www.sanity.io) como CMS, consumido en modo solo lectura vía GROQ.
- [Zustand](https://zustand-demo.pmnd.rs) con `persist` para el carrito.
- Checkout y contacto por enlace `wa.me`.

## Quickstart

Requiere **Node 20.9+** (recomendado: Node 22, ver `.nvmrc`) y **npm 10+**.

### 1. Instalar y correr la tienda

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app corre en `http://localhost:3000`. Sin un proyecto de Sanity configurado, las
páginas renderizan con los textos de respaldo (fallbacks) que están en el código —
así puedes ver la tienda funcionando antes de cargar contenido real.

### 2. Crear el proyecto de Sanity

```bash
cd sanity
npm install
npx sanity login
npx sanity init --env   # crea el proyecto y escribe .env con el project ID
```

Copia el `projectId` que te da Sanity a **ambos** archivos de entorno:

- `sanity/.env` (o `.env.example` como referencia) → `SANITY_STUDIO_PROJECT_ID`
- `.env.local` (raíz del proyecto) → `NEXT_PUBLIC_SANITY_PROJECT_ID`

### 3. Desplegar el Studio en Sanity Cloud

```bash
cd sanity
npm run deploy
```

Esto publica el Studio como una app alojada por Sanity (algo como
`https://tu-proyecto.sanity.studio`) — **no** corre en tu máquina ni en ningún
servidor propio. Todo el equipo edita el contenido ahí, desde el navegador.
`npm run dev` (Studio local) es solo para probar un cambio de esquema antes de
desplegarlo de nuevo con `npm run deploy`; no es parte del flujo normal de trabajo.

Abre la URL que te dio el deploy, completa **Configuración del sitio** (nombre,
número de WhatsApp, contacto) y **Página de inicio**, y carga algunas categorías,
productos y artículos del blog.

### 4. Desplegar la tienda en Vercel

1. Importa el repo en Vercel.
2. Configura las variables de entorno del `.env.example` de la raíz (ver abajo).
3. Deploy.

## Variables de entorno (raíz del proyecto)

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto de Sanity. |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset a leer (`production` por defecto). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Versión de la API de Sanity (fecha, formato `YYYY-MM-DD`). |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. Se usa para canonical, sitemap, OG y JSON-LD. |
| `SANITY_API_READ_TOKEN` | Opcional. Solo si el dataset es privado (no recomendado para este boilerplate). |

El Studio (`sanity/`) tiene su propio `.env.example` con `SANITY_STUDIO_PROJECT_ID`
y `SANITY_STUDIO_DATASET` — es un proyecto Node independiente, no se despliega junto
con la tienda.

## Estructura del contenido (Sanity)

- **siteSettings** (singleton) — nombre, logo, WhatsApp, contacto, redes, SEO por defecto.
- **landingPage** (singleton) — hero, sección "nosotros", texto de contacto.
- **promoBanner** — banner promocional de la tienda (se muestra el más reciente activo).
- **category** — categorías de producto.
- **product** — nombre, imágenes, precio, descripción, categoría, stock, destacado, SEO.
- **blogCategory** — categorías del blog.
- **post** — artículos del blog (Portable Text), con categoría, autor y SEO.

Los esquemas están en `sanity/schemas/` y son la **fuente de verdad** del modelo
de contenido — viven en el código y viajan con el repo, aunque el Studio en sí
se despliegue por separado en la nube de Sanity. Un cambio de esquema se edita
acá, se prueba con `npm run dev` si hace falta, y se publica con `npm run deploy`.

## Cómo rebautizar (re-skin) la tienda para un cliente nuevo

1. **Colores y marca**: edita las variables CSS en `app/globals.css` (`--primary`,
   `--background`, etc. en formato HSL) y el radio de bordes en `--radius`.
2. **Tipografías**: cambia las fuentes importadas en `app/layout.tsx` (`next/font/google`).
3. **Contenido**: todo lo demás (nombre, logo, copys, productos, blog) se edita en
   el Studio de Sanity alojado en la nube (`https://tu-proyecto.sanity.studio`) —
   no requiere tocar código ni volver a desplegar nada.
4. **WhatsApp**: el número vive en `siteSettings.whatsappNumber` — un solo lugar.

## Dónde está cada cosa (arquitectura)

- `app/` — rutas (App Router). `/`, `/tienda`, `/tienda/[slug]`, `/blog`,
  `/blog/[slug]`, `/blog/categoria/[slug]`, `/carrito`, `sitemap.ts`, `robots.ts`.
- `lib/sanity/` — único punto de acceso a datos (`client.ts`, `queries.ts`,
  `image.ts`, `types.ts`). Un futuro backend o caché solo toca esta carpeta.
- `lib/cart/store.ts` — estado del carrito (Zustand + `localStorage`).
- `lib/whatsapp.ts` — arma los mensajes y enlaces `wa.me` de checkout y contacto.
- `lib/seo.ts` — helpers de `Metadata` y JSON-LD reutilizados en cada ruta.
- `components/ui/` — primitivas de UI propias (botón, sheet, input, select…).
- `components/store/`, `components/blog/`, `components/cart/`, `components/sections/`,
  `components/layout/` — componentes de dominio, organizados por área.
- `sanity/` — esquemas y configuración del Studio, con su propio `package.json`.
  Es la fuente de verdad del modelo de contenido, pero no corre junto a la
  tienda: se publica una vez (y cada vez que cambia un esquema) con
  `npm run deploy`, y desde ahí vive alojado por Sanity. La tienda de Next.js
  nunca ejecuta ni embebe el Studio — solo lee datos de la API cloud de Sanity.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build       # build de producción (tipos + lint deben pasar)
npm run start        # sirve el build de producción
npm run lint          # ESLint
npm run typecheck      # TypeScript sin emitir
```

## Notas / supuestos

- No hay persistencia de pedidos: el checkout y el formulario de contacto solo
  arman un mensaje (WhatsApp o `mailto:`), no hay servidor propio ni base de datos.
- Si un cliente necesita guardar pedidos en el futuro, `lib/sanity/` y
  `lib/cart/store.ts` son los únicos puntos de integración — se puede agregar un
  backend ahí sin tocar la UI.
- El Studio de Sanity nunca se embebe en la tienda ni corre en un servidor propio:
  se despliega una vez con `npm run deploy` dentro de `sanity/` y queda alojado
  por Sanity Cloud. La tienda de Next.js solo consume esa API cloud — nunca hay
  un cliente de Sanity corriendo localmente ni desplegado en infraestructura del
  desarrollador. Los esquemas en `sanity/schemas/` son la fuente de verdad del
  modelo de contenido.
