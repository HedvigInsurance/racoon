import { StoryblokComponent, StoryData } from '@storyblok/react'
import Head from 'next/head'

export const StorePage = (story: StoryData) => {
  return (
    <>
      <Head>
        <title>Store</title>
      </Head>
      <StoryblokComponent blok={story.content} />
    </>
  )
}
