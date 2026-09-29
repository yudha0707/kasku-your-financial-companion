/**
 * API layer. Every service checks USE_MOCK:
 *  - true  -> reads/writes the in-browser mock store (localStorage)
 *  - false -> calls the REST backend at VITE_API_URL via `request()`
 *
 * To connect your Laravel/PHP backend: set VITE_USE_MOCK=false and VITE_API_URL.
 */
export const API_URL: string = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8000/api";
export const USE_MOCK: boolean = (import.meta.env["VITE_USE_MOCK"] as string | undefined) !== "false";

export const TOKEN_KEY = "kasku:token";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = "Terjadi kesalahan";
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Simulated network latency for mock mode (lets loading states show). */
export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
