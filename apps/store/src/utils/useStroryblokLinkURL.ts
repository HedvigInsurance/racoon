import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { LinkField } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export const useStroryblokLinkURL = (link: LinkField) => {
  const locale = useCurrentLocale()
  return getLinkFieldURL(link, locale)
}
