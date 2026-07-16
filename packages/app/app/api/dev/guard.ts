/**
 * The dev-only gate for the authoring API.
 *
 * These routes write to lib/curriculum/packs/. A route handler that edits the
 * corpus must not exist in a deployed build — this is the one hard security line
 * in the tool. 404 rather than 403: in production the route does not exist, and
 * saying so is not the API's job.
 */

export const isDev = process.env.NODE_ENV === 'development'

export function notFound(): Response {
  return new Response('Not found', { status: 404 })
}
