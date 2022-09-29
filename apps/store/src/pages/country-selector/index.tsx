import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { FALLBACK_LOCALE, routingLocale } from '@/lib/l10n/locales'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'
import { isSupportedLocale } from '@/utils/isSupportedLocale'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (!isSupportedLocale(locale)) {
    locale = routingLocale(FALLBACK_LOCALE)
  }

  const [globalStory] = await Promise.all([getGlobalStory({ locale })])

  return {
    props: {
      globalStory,
    },
  }
}

const NextCountrySelectorPage: NextPageWithLayout<StoryblokPageProps> = (props) => {
  return <CountrySelectorPage {...props} />
}

export default NextCountrySelectorPage
