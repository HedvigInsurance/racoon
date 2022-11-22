import { ProductDataQuery } from '@/services/apollo/generated'
import { Template } from '@/services/PriceForm/PriceForm.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { ProductStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

export type ProductData = Exclude<ProductDataQuery['product'], null | undefined>

export type ProductPageProps = StoryblokPageProps & {
  story: ProductStory
  priceTemplate: Template
  productData: ProductData
  priceIntent: PriceIntent
  shopSession: ShopSession
}
