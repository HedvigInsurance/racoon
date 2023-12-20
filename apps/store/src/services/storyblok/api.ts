import { apiPlugin, storyblokInit } from '@storyblok/js'

const { storyblokApi } = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    cache: {
      type: 'memory',
      clear: 'auto',
    },
  },
})

export const getStoryblokApi = () => {
  if (!storyblokApi) {
    throw new Error('Storyblok API not initialized')
  }
  return storyblokApi
}
