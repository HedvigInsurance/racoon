import { StoryData } from '@storyblok/react'
import Head from 'next/head'

export const HeadSeoInfo = ({ story }: { story: StoryData }) => {
  const { canonicalUrl } = story.content

  return <Head>{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}</Head>
}
