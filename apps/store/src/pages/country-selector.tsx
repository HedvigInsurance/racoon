import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { FALLBACK_LOCALE } from '@/utils/l10n/locales'
import { isRoutingLocale, toRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let routingLocale: RoutingLocale
  if (isRoutingLocale(locale)) routingLocale = locale
  else routingLocale = toRoutingLocale(FALLBACK_LOCALE)

  const [globalStory, translations] = await Promise.all([
    getGlobalStory({ locale: routingLocale }),
    serverSideTranslations(routingLocale),
  ])

  return {
    props: {
      ...translations,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
    },
  }
}

const NextCountrySelectorPage: NextPageWithLayout<StoryblokPageProps> = (props) => {
  return <CountrySelectorPage {...props} />
}

export default NextCountrySelectorPage
