import { useStoryblokState } from '@storyblok/react'
import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { StorePage } from '@/components/StorePage/StorePage'
import { getStoreStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

const NextStorePage: NextPageWithLayout<StoryblokPageProps> = ({ story: initialStory }) => {
  const story = useStoryblokState(initialStory)

  return <StorePage {...story} />
}

export const getServerSideProps: GetServerSideProps<StoryblokPageProps> = async (context) => {
  const story = await getStoreStory(context.preview)
  console.log(story)

  return {
    props: {
      story,
    },
  }
}

NextStorePage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextStorePage
