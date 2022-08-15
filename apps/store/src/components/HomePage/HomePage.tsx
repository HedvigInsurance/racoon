import { StoryblokComponent, StoryData } from '@storyblok/react'
import Head from 'next/head'

export const HomePage = (story: StoryData) => {
  return (
    <>
      <Head>
        <title>{story.name}</title>
      </Head>
      <StoryblokComponent blok={story.content} />
    </>
  )
}
