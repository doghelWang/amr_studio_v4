/**
 * Worker entry point. A Workers entry module may only export handlers, so the API itself lives in ./api.
 */
import { fail, handleApi, type Env } from './api';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (err) {
        // Never leak a raw exception to the user (REQ-EX-01).
        console.error(err);
        return fail(500, 'internal_error', 'The request could not be completed');
      }
    }
    return env.ASSETS ? env.ASSETS.fetch(request) : fail(404, 'not_found');
  },
};
