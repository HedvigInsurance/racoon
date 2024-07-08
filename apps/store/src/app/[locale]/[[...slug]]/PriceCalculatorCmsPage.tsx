import 'server-only'
import { notFound } from 'next/navigation'
import { PriceCalculatorPage } from '@/components/PriceCalculatorPage/PriceCalculatorPage'
import { type PriceCalculatorPageStory } from '@/services/storyblok/storyblok'

type Props = {
  story: PriceCalculatorPageStory
}

export function PriceCalculatorCmsPage(props: Props) {
  if (process.env.FEATURE_PRICE_CALCULATOR_PAGE !== 'true') {
    throw notFound()
  }
  // TODO: Remove
  console.log('priceCalculatorPage props', props)
  return <PriceCalculatorPage />
}
