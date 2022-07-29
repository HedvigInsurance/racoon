import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory } from '@/services/storyblok/storyblok'

export type ProductPageProps = {
  story: ProductStory
  priceFormTemplate: FormTemplate
  priceIntent: PriceIntent
  shopSession: ShopSession
}
