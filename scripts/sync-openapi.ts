/**
 * Sync the OpenAPI spec from the main thesignup app into this docs site.
 *
 * Source of truth lives in the thesignup repo — it auto-generates openapi.json
 * from Zod. The docs site is a downstream consumer.
 *
 * Two sources, tried in order:
 *
 *   1. Sibling checkout at `../thesignup/openapi.json`. Used in local dev
 *      where both repos live next to each other. Zero network, instant.
 *   2. Live API endpoint at `https://thesignup.app/api/v1/openapi`. Used on
 *      Vercel builds (no sibling repo) and anywhere else without a local
 *      checkout. The main app caches this for 5 minutes, so build cost is
 *      small.
 *
 * The thesignup repo itself is private, so we can't fetch the committed
 * `openapi.json` from raw.githubusercontent.com without auth — the public
 * /api/v1/openapi endpoint is the right cross-build channel.
 *
 * Run automatically before `dev` and `build` via npm `pre*` scripts.
 */
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const sibling = resolve(repoRoot, '..', 'thesignup', 'openapi.json');
const destDir = join(repoRoot, 'openapi');
const dest = join(destDir, 'thesignup.json');
const liveUrl = process.env.OPENAPI_SOURCE_URL ?? 'https://thesignup.app/api/v1/openapi';

mkdirSync(destDir, { recursive: true });

async function main(): Promise<void> {
  if (existsSync(sibling)) {
    copyFileSync(sibling, dest);
    console.log(`[sync-openapi] Copied ${sibling} -> ${dest}`);
    return;
  }

  console.log(
    `[sync-openapi] Sibling not found at ${sibling}. Fetching from ${liveUrl}…`,
  );
  const res = await fetch(liveUrl);
  if (!res.ok) {
    console.error(
      `[sync-openapi] Fetch failed: ${res.status} ${res.statusText} from ${liveUrl}`,
    );
    if (existsSync(dest)) {
      console.warn(`[sync-openapi] Using stale spec at ${dest}.`);
      return;
    }
    process.exit(1);
  }
  const body = await res.text();
  writeFileSync(dest, body, 'utf8');
  console.log(
    `[sync-openapi] Fetched ${body.length} bytes from ${liveUrl} -> ${dest}`,
  );
}

main().catch((err) => {
  console.error(`[sync-openapi] Unexpected error: ${(err as Error).message}`);
  process.exit(1);
});
