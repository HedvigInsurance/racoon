const TODAY = new Date()

export const fromNow = (dateObj: Date, locale: string) => {
  const diff = Math.abs(TODAY.getTime() - dateObj.getTime())
  const diffDays = Math.floor(diff / (1000 * 3600 * 24))
  return diffDays === 0 ? 'Today' : dateObj.toLocaleDateString(locale)
}

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
