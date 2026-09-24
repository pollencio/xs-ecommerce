import { createClient } from "@sanity/client";

/**
 * The only place in the app that knows about Sanity's SDK. All data
 * fetching goes through lib/sanity/queries.ts, which uses this client —
 * swapping the CMS or adding a database later only touches this folder.
 */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
);

// Falls back to a placeholder project id (rather than leaving it undefined)
// so the client always constructs successfully. Before a real project id is
// set, every query in queries.ts fails at request time and resolves to its
// fallback — the app still renders, with the fallback copy baked into each
// section, instead of crashing the build or every page.
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01",
  useCdn: true,
  // Only used if the dataset is private. Public read-only datasets (the
  // default for this boilerplate) don't need it.
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
