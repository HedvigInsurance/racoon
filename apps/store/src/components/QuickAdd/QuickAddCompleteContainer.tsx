import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { PRELOADED_PRICE_INTENT_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { ORIGIN_URL } from '@/utils/PageLink'
import { AddToCartButton } from './AddToCartButton'
import { ProductDetail, QuickAdd } from './QuickAdd'

type Props = {
  shopSessionId: string
  priceIntentId: string
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export const QuickAddCompleteContainer = (props: Props) => {
  const { t } = useTranslation('cart')
  const subtitle = useProductSubtitle(props.offer)

  const price = getOfferPrice(props.offer.cost)

  const editLink = new URL(props.product.pageLink, ORIGIN_URL)
  editLink.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
  editLink.searchParams.set(PRELOADED_PRICE_INTENT_QUERY_PARAM, props.priceIntentId)

  return (
    <QuickAdd
      title={props.product.displayNameFull}
      subtitle={subtitle}
      pillow={props.product.pillowImage}
      href={props.product.pageLink}
      price={price}
      Body={
        <ul>
          {props.offer.displayItems.map((item) => (
            <ProductDetail key={item.key} value={item.displayValue}>
              {item.displayTitle}
            </ProductDetail>
          ))}
        </ul>
      }
    >
      <AddToCartButton
        shopSessionId={props.shopSessionId}
        productName={props.product.name}
        offer={props.offer}
      />
      <ButtonNextLink size="medium" variant="ghost" href={editLink}>
        {t('QUICK_ADD_EDIT')}
      </ButtonNextLink>
    </QuickAdd>
  )
}

const STREET_ADDRESS_DATA_KEY = 'street'

const useProductSubtitle = (offer: OfferRecommendationFragment) => {
  // Assume Home insurance
  const streetAddress = offer.priceIntentData[STREET_ADDRESS_DATA_KEY]
  if (typeof streetAddress === 'string') {
    return streetAddress
  }

  // Should never happen
  datadogLogs.logger.error('Quick Add Complete | street address not found', {
    productOfferId: offer.id,
    product: offer.product.id,
  })
  return ''
}
