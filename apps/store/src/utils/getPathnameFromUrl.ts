export const getPathnameFromUrl = (rawUrl: string) => {
  if (rawUrl.startsWith('https://')) {
    return new URL(rawUrl).pathname
  }

  return rawUrl
}
