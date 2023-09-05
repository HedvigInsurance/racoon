import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { PRELOADED_PRICE_INTENT_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/usePreloadedPriceIntentId'
import {
  OfferRecommendationFragment,
  ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'
import { ProductDetail, QuickAdd } from './QuickAdd'

const STREET_ADDRESS_DATA_KEY = 'street'

type Props = {
  shopSessionId: string
  priceIntentId: string
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export const QuickAddCompleteContainer = (props: Props) => {
  const { t } = useTranslation('cart')

  const [addToCart, loading] = useAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Quick Add Complete | added offer to cart', {
        productOfferId: props.offer.id,
        product: props.product.id,
      })
    },
  })

  const tracking = useTracking()
  const handleAdd = () => {
    datadogRum.addAction('Quick Add To Cart', {
      type: 'complete',
      productOfferId: props.offer.id,
      product: props.product.id,
    })
    tracking.reportAddToCart(props.offer, 'recommendations')
    addToCart(props.offer.id)
  }

  // TODO: Exposure -> should be fetched from API
  const subtitle = props.offer.priceIntentData[STREET_ADDRESS_DATA_KEY]

  const cost = {
    currencyCode: props.offer.cost.net.currencyCode,
    amount: props.offer.cost.gross.amount,
    reducedAmount: props.offer.cost.discount.amount > 0 ? props.offer.cost.net.amount : undefined,
  } as const

  const editLink = new URL(props.product.pageLink)
  editLink.searchParams.set(OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
  editLink.searchParams.set(PRELOADED_PRICE_INTENT_QUERY_PARAM, props.priceIntentId)

  return (
    <QuickAdd
      title={props.product.displayNameFull}
      subtitle={subtitle}
      pillow={props.product.pillowImage}
      href={props.product.pageLink}
      cost={cost}
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
      <Button loading={loading} onClick={handleAdd}>
        {t('QUICK_ADD_BUTTON')}
      </Button>
      <ButtonNextLink variant="ghost" href={editLink}>
        {t('QUICK_ADD_EDIT')}
      </ButtonNextLink>
    </QuickAdd>
  )
}
