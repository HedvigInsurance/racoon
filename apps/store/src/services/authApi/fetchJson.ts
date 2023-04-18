export const fetchJson = async <T extends object>(
  url: string,
  options?: Partial<RequestInit>,
): Promise<T> => {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Content-type': 'application/json',
      ...options?.headers,
    },
  })
  const data = (await resp.json()) as T
  if (!resp.ok) {
    throw new ServerError(`Error response, status=${resp.status}`, data)
  }
  return data
}

export class ServerError extends Error {
  constructor(message: string, public data: any) {
    super(message)
  }
}
