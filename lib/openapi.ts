import { createOpenAPI } from 'fumadocs-openapi/server';

/**
 * Single OpenAPI server instance reading the synced spec.
 * Spec is copied from ../thesignup/openapi.json by scripts/sync-openapi.ts.
 */
export const openapi = createOpenAPI({
  input: ['./openapi/thesignup.json'],
});
