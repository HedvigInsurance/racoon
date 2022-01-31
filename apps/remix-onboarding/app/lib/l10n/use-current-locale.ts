import type { Locale } from '~/lib/types'
import invariant from 'tiny-invariant'
import { locales } from './locales'
import { useParams } from 'remix'

export const useCurrentLocale = () => {
  const params = useParams()
  invariant(typeof params.locale === 'string', 'locale is required')
  return locales[params.locale as Locale]
}
