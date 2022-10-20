import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { FALLBACK_LOCALE } from '@/lib/l10n/locales'
import { isRoutingLocale, toRoutingLocale } from '@/lib/l10n/localeUtils'
import { RoutingLocale } from '@/lib/l10n/types'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let routingLocale: RoutingLocale
  if (isRoutingLocale(locale)) routingLocale = locale
  else routingLocale = toRoutingLocale(FALLBACK_LOCALE)

  return {
    props: {
      [GLOBAL_STORY_PROP_NAME]: await getGlobalStory({ locale: routingLocale }),
    },
  }
}

const NextCountrySelectorPage: NextPageWithLayout<StoryblokPageProps> = (props) => {
  return <CountrySelectorPage {...props} />
}

export default NextCountrySelectorPage
