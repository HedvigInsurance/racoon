import { useParams, usePathname } from 'next/navigation'
import { getLocaleOrFallback } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

export const useCurrentLocale = () => {
  // useParams() would return undefined during static rendering and hydration of statically rendered pages
  // But usePathname keeps working, so we're using it as a fallback
  let { locale } = (useParams() as { locale: RoutingLocale } | undefined) ?? {}
  // usePathname will return null when building pages without static paths, hence the fallback
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const pathname = usePathname() as string | null
  if (locale === undefined) {
    if (pathname != null) {
      locale = pathname.split('/')[1] as RoutingLocale
    }
  }
  return getLocaleOrFallback(locale)
}
