import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapi } from './openapi';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

/**
 * Generate OpenAPI virtual pages once at module load time.
 *
 * These are mounted under the `/api` subtree in the docs page tree and
 * rendered by app/docs/[[...slug]]/page.tsx via createAPIPage().
 *
 * Top-level await is safe in Next.js server components / route segments.
 */
const apiSource = await openapi.staticSource({
  baseDir: 'api',
});

/**
 * Combined Fumadocs source: MDX prose pages from /content/docs +
 * auto-generated OpenAPI reference pages mounted at /docs/api.
 *
 * See https://fumadocs.dev/docs/headless/source-api for more info.
 */
export const source = loader({
  baseUrl: docsRoute,
  source: {
    docs: docs.toFumadocsSource(),
    api: apiSource,
  },
  plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  // OpenAPI pages don't have a `getText` method on their page data
  if (!('getText' in page.data)) {
    return `# ${page.data.title} (${page.url})\n`;
  }
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
