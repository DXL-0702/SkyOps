export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const GENERIC_API_ERROR_MESSAGE =
  "SkyOps service is not available right now. Start the backend and try again.";

type ApiRequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export class ApiRequestError extends Error {
  constructor(
    message = GENERIC_API_ERROR_MESSAGE,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiRequestError();
  }

  if (!response.ok) {
    await readErrorDetail(response);
    throw new ApiRequestError(GENERIC_API_ERROR_MESSAGE, response.status);
  }

  return response.json() as Promise<TResponse>;
}

async function readErrorDetail(response: Response): Promise<string | null> {
  try {
    const payload = (await response.json()) as { detail?: unknown };
    return typeof payload.detail === "string" ? payload.detail : null;
  } catch {
    return null;
  }
}
