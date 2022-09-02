import { useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HomePage } from '@/components/HomePage/HomePage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getGlobalStory, getStoryBySlug, StoryblokPageProps } from '@/services/storyblok/storyblok'

const NextHomePage: NextPageWithLayout<StoryblokPageProps> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)
  return <HomePage {...story} />
}

export const getStaticProps: GetStaticProps<StoryblokPageProps> = async ({ preview, locale }) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (!locale || locale === 'default') return { notFound: true }

  const slug = 'home'
  const [story, globalStory] = await Promise.all([
    getStoryBySlug(slug, { locale, preview }),
    getGlobalStory({ locale, preview }),
  ])

  if (story === undefined) throw new Error('Unable to find home page story')

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      story,
      globalStory,
    },
  }
}

NextHomePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextHomePage
