import type { StoryblokBridgeConfigV2 } from '@storyblok/js'
import { ORIGIN_URL } from '@/utils/url'

export const storyblokBridgeOptions: StoryblokBridgeConfigV2 = {
  ...(process.env.VERCEL_ENV === 'development' && { customParent: ORIGIN_URL }),
}
