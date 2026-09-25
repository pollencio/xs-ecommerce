import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const appId = process.env.SANITY_STUDIO_APP_ID;

export default defineCliConfig({
  api: { projectId, dataset },
  // Per-deployment id for the hosted Studio (one per client's clone) —
  // kept out of source so this stays a clean template. Set
  // SANITY_STUDIO_APP_ID locally to skip the "reuse this app?" prompt on
  // repeat deploys.
  deployment: appId ? { appId } : undefined,
});
