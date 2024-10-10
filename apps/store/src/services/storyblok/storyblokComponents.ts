import { blogBlocks } from '@/features/blog/blogBlocks'
import { carDealershipBlocks } from '@/features/carDealership/carDealershipBlocks'
import { commonStoryblokComponents } from '@/services/storyblok/commonStoryblokComponents'

export const storyblokComponents = {
  ...commonStoryblokComponents,
  ...blogBlocks,
  ...carDealershipBlocks,
}
