import 'server-only'
import { notFound } from 'next/navigation'
import { PriceCalculatorPage } from '@/components/PriceCalculatorPage/PriceCalculatorPage'
import { type PriceCalculatorPageStory } from '@/services/storyblok/storyblok'
import { type RoutingLocale } from '@/utils/l10n/types'

type Props = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
}

export function PriceCalculatorCmsPage(props: Props) {
  if (process.env.FEATURE_PRICE_CALCULATOR_PAGE !== 'true') {
    throw notFound()
  }
  console.log('priceCalculatorPage', props)
  return <PriceCalculatorPage locale={props.locale} />
}
