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

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  // We wrap the raw fetch in try/catch so that network failures (Docker backend
  // not running, DNS issues, etc.) get turned into a readable ApiError.
  // AbortError is re-thrown as-is so React can silently ignore unmounted fetches.
  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (cause) {
    if ((cause as Error)?.name === "AbortError") {
      throw cause;
    }
    throw new ApiError(
      "Could not reach the Athletics Sports Club API. Is the Docker backend running on port 8000?",
      0,
    );
  }

  // Non-2xx responses are turned into ApiError too so consumers only need one
  // error-handling path regardless of whether the failure is network or HTTP.
  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}.`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
