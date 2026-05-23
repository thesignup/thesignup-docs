# thesignup-docs

Developer documentation for [thesignup](../thesignup), built with [Fumadocs](https://fumadocs.dev) + Next.js.

## What's in here

- **MDX prose** in `content/docs/` — landing, MCP, SDKs, CLI, auth.
- **Auto-generated API reference** at `/docs/api/*` rendered from the OpenAPI 3.1 spec via [`fumadocs-openapi`](https://fumadocs.dev/docs/openapi).
- The OpenAPI spec is **synced from the main repo** by `scripts/sync-openapi.ts` (runs on `predev` + `prebuild`). Source of truth: `../thesignup/openapi.json`.

## Develop

```bash
npm install
npm run dev
```

The `predev` hook copies `../thesignup/openapi.json` into `openapi/thesignup.json` (gitignored). Open http://localhost:3000.

## Build

```bash
npm run build
```

`prebuild` runs the same sync. The build is fully static — Vercel can deploy it directly.

## Layout

| Path                                 | Purpose                                       |
| ------------------------------------ | --------------------------------------------- |
| `app/(home)/page.tsx`                | Marketing-style landing page                  |
| `app/docs/[[...slug]]/page.tsx`      | Renders both MDX pages and OpenAPI operations |
| `app/api/search/route.ts`            | Orama-backed search                           |
| `content/docs/`                      | MDX prose                                     |
| `lib/openapi.ts`                     | `createOpenAPI()` reading the synced spec     |
| `lib/source.ts`                      | Combined Fumadocs source (MDX + OpenAPI)      |
| `openapi/thesignup.json`             | Synced spec (gitignored)                      |
| `scripts/sync-openapi.ts`            | Spec sync from `../thesignup/openapi.json`    |
