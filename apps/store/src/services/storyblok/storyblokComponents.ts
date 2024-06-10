import { blogBlocks } from '@/features/blog/blogBlocks'
import { carDealershipBlocks } from '@/features/carDealership/carDealershipBlocks'
import { manyPetsBlocks } from '@/features/manyPets/manyPetsBlocks'
import { commonStoryblokComponents } from '@/services/storyblok/commonStoryblokComponents'

export const storyblokComponents = {
  ...commonStoryblokComponents,
  ...blogBlocks,
  ...carDealershipBlocks,
  ...manyPetsBlocks,
}
