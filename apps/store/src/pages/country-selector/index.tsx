import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { FALLBACK_LOCALE } from '@/lib/l10n/locales'
import { isRoutingLocale, toRoutingLocale } from '@/lib/l10n/localeUtils'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (!isRoutingLocale(locale)) {
    locale = toRoutingLocale(FALLBACK_LOCALE)
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
