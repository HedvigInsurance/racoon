import 'server-only'
import { notFound } from 'next/navigation'
import { type PriceCalculatorPageStory } from '@/services/storyblok/storyblok'

type Props = {
  story: PriceCalculatorPageStory
}

export function PriceCalculatorCmsPage(props: Props) {
  if (process.env.FEATURE_PRICE_CALCULATOR_PAGE !== 'true') {
    throw notFound()
  }
  console.log('priceCalculatorPage', props)
  return <h1>TODO: Price calculator page</h1>
}
