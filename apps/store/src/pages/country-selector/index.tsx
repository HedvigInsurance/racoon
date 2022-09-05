// import { useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CountrySelectorPage } from '@/components/CountrySelectorPage/CountrySelectorPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { Locale } from '@/lib/l10n/types'
import { getGlobalStory, getStoryBySlug, StoryblokPageProps } from '@/services/storyblok/storyblok'

export const getStaticProps: GetStaticProps<StoryblokPageProps> = async ({
  preview,
  locale = Locale.SvSe,
}) => {
  // Can be removed when we handle default locals
  const getLocation = locale === 'default' ? Locale.SvSe : locale

  const slug = 'home'
  const [story, globalStory] = await Promise.all([
    getStoryBySlug(slug, { locale: getLocation as string, preview }),
    getGlobalStory({ locale: getLocation as string, preview }),
  ])

  if (story === undefined) throw new Error('Unable to find page story')

  return {
    props: {
      ...(await serverSideTranslations('sv-se')),
      story,
      globalStory,
    },
  }
}

const NextCountrySelectorPage: NextPageWithLayout<StoryblokPageProps> = (props) => {
  return <CountrySelectorPage {...props} />
}

NextCountrySelectorPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCountrySelectorPage
