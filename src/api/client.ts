// Thin HTTP layer for the Athletics Sports Club REST API.
// Every page talks to the backend through this module so we keep the base URL,
// the error shape and the fetch options in a single place.

const DEFAULT_BASE_URL = "http://localhost:8000/api/v1";

// The base URL can be overridden at build time with a Vite env variable.
// This lets us point the frontend at a different backend (e.g. a deployed one)
// without touching the source code.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL;

// Custom error type so the UI layer can distinguish API failures from generic
// JavaScript errors and render a friendly ErrorState.
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Shared network-error wrapper used by both fetchJson and mutateJson.
function wrapNetworkError(cause: unknown, path: string): never {
  if ((cause as Error)?.name === "AbortError") throw cause;
  throw new ApiError(
    `Could not reach the Athletics Sports Club API (${path}). Is the Docker backend running on port 8000?`,
    0,
  );
}

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    wrapNetworkError(cause, path);
  }

  if (!response!.ok) {
    // Try to surface a backend validation message if the body contains one.
    let detail = `Request to ${path} failed with status ${response!.status}.`;
    try {
      const body = await response!.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (typeof body?.message === "string") detail = body.message;
    } catch { /* empty */ }
    throw new ApiError(detail, response!.status);
  }

  return (await response!.json()) as T;
}

// Generic write helper for POST / PUT / PATCH / DELETE.
// Returns null for 204 No Content; otherwise parses the response body as JSON.
export async function mutateJson<T = void>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T | null> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (cause) {
    wrapNetworkError(cause, path);
  }

  if (!response!.ok) {
    let detail = `Request to ${path} failed with status ${response!.status}.`;
    try {
      const err = await response!.json();
      if (typeof err?.detail === "string") detail = err.detail;
      else if (typeof err?.message === "string") detail = err.message;
    } catch { /* empty */ }
    throw new ApiError(detail, response!.status);
  }

  if (response!.status === 204) return null;
  return (await response!.json()) as T;
}
