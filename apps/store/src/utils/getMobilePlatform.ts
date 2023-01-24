/**
 * Determine the mobile platform from user agent header.
 */
export const getMobilePlatform = (userAgent: string) => {
  if (/android/i.test(userAgent)) {
    return 'google'
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'apple'
  }

  return null
}
