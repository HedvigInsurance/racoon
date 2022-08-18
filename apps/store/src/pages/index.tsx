import { useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, NextPageWithLayout } from 'next'
import { HomePage } from '@/components/HomePage/HomePage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getGlobalStory, getStoryBySlug, StoryblokPageProps } from '@/services/storyblok/storyblok'

const NextHomePage: NextPageWithLayout<StoryblokPageProps> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)
  return <HomePage {...story} />
}

export const getStaticProps: GetStaticProps = async ({ preview }) => {
  const slug = 'home'
  const [story, globalStory] = await Promise.all([
    getStoryBySlug(slug, preview),
    getGlobalStory(preview),
  ])

  return {
    props: {
      story: story ?? false,
      globalStory: globalStory ?? false,
      key: story ? story.id : false,
      preview: preview || false,
    },
  }
}

NextHomePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextHomePage
