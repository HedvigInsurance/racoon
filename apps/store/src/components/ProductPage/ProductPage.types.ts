import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceFormTemplate: FormTemplate
  priceIntent: PriceIntent
  shopSession: ShopSession
}
