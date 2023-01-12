export const fetchJson = async <T extends object>(
  url: string,
  options?: Partial<RequestInit>,
): Promise<T> => {
  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(`Error response, status=${resp.status}`, data)
  }
  return data
}
