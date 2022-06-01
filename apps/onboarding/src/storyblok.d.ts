declare module '@storyblok/react' {
  import { SbSDKOptions, StoryData } from '@storyblok/js'
  import { StoryblokClient } from 'storyblok-js-client'

  type StoryblokPlugin = (options: SbSDKOptions) => { storyblokApi: StoryblokClient }

  type SDKOptions = Omit<SbSDKOptions, 'use'> & { use: StoryblokPlugin[] }

  export function getStoryblokApi(): StoryblokClient

  export function storyblokInit(options: SDKOptions): void

  export const apiPlugin: StoryblokPlugin

  export type StoryblokStoryData = StoryData

  export function useStoryblokState(story: StoryblokStoryData): StoryblokStoryData
}
