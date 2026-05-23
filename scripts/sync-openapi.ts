/**
 * Sync the OpenAPI spec from the main thesignup repo into this docs site.
 *
 * Source of truth lives in the thesignup app — it auto-generates openapi.json
 * from Zod. We copy it here so the docs build is self-contained and doesn't
 * rely on relative paths at build time on Vercel.
 *
 * Run automatically before `dev` and `build` via npm `pre*` scripts.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// Source: ../thesignup/openapi.json relative to this docs repo
const source = resolve(repoRoot, '..', 'thesignup', 'openapi.json');
const destDir = join(repoRoot, 'openapi');
const dest = join(destDir, 'thesignup.json');

if (!existsSync(source)) {
  console.warn(
    `[sync-openapi] Source not found at ${source}. ` +
      `Skipping sync — docs will use existing ${dest} if present.`,
  );
  if (!existsSync(dest)) {
    console.error(
      `[sync-openapi] No existing spec at ${dest} either. Docs build will fail.`,
    );
    process.exit(1);
  }
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
console.log(`[sync-openapi] Copied ${source} -> ${dest}`);
