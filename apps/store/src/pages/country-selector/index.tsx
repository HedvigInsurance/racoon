// import { useStoryblokState } from '@storyblok/react'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { Locale } from '@/lib/l10n/types'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export const getServerSideProps: GetServerSideProps = async ({ locale = Locale.EnSe }) => {
  // Can be removed when we handle default locals
  const getLocation = () => (locale === 'default' ? Locale.EnSe : locale)

  const [globalStory] = await Promise.all([getGlobalStory({ locale: getLocation() })])

  return {
    props: {
      globalStory,
    },
  }
}

const NextCountrySelectorPage: NextPageWithLayout<StoryblokPageProps> = (props) => {
  return <CountrySelectorPage {...props} />
}

NextCountrySelectorPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCountrySelectorPage
