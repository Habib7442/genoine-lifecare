/**
 * Config for the `sanity` CLI (e.g. `pnpm dlx sanity@latest cors add ...`,
 * `sanity dataset export`). Reads the same env vars as the app.
 */
import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({ api: { projectId, dataset } });
