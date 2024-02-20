'use client'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import { PropsWithChildren } from 'react'

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  // TODO: bridge, etc
})

const StoryblokProvider = ({ children }: PropsWithChildren) => {
  return children
}

export default StoryblokProvider
