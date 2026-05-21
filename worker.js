/**
 * Cloudflare Workers main entry point
 * Handles both frontend page serving and backend API
 */

import { handleApiRequest } from './api/router';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }

    // For SPA, serve index.html for all non-API routes
    // This allows Vue Router to handle client-side routing
    // Clone the original request to preserve headers and other properties
    const indexHtmlRequest = new Request(`${url.origin}/index.html`, request);
    return env.ASSETS.fetch(indexHtmlRequest);
  },
};