import { useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, NextPageWithLayout } from 'next'
import { HomePage } from '@/components/HomePage/HomePage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getStoryBySlug, StoryblokPageProps } from '@/services/storyblok/storyblok'

const NextHomePage: NextPageWithLayout<StoryblokPageProps> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)
  return <HomePage {...story} />
}

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const slug = 'home'
  const story = await getStoryBySlug(slug, preview)

  return {
    props: {
      story: story ?? false,
      key: story ? story.id : false,
      preview: preview || false,
    },
  }
}

NextHomePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextHomePage
