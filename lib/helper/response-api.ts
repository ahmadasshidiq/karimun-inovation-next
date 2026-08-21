export type ApiResponse<T = unknown> = {
  message?: string;
  data?: T;
  total?: number;
  [key: string]: unknown;
};

const readApiResponse = async (response: Response) =>
  (await response.json().catch(() => ({}))) as ApiResponse;

export async function parseApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  const payload = await readApiResponse(response);
  return typeof payload.message === "string" && payload.message.trim()
    ? payload.message
    : fallback;
}

export async function parseApiResponse<T extends ApiResponse = ApiResponse>(
  response: Response,
  fallback: string,
): Promise<T> {
  const payload = (await readApiResponse(response)) as T;

  if (!response.ok) {
    throw new Error(
      typeof payload.message === "string" && payload.message.trim()
        ? payload.message
        : fallback,
    );
  }

  return payload;
}
