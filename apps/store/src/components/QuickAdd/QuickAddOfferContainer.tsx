import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import {
  CartFragmentFragment,
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
import { DismissButton } from './DismissButton'
import { QuickAdd } from './QuickAdd'
import { useShowQuickAdd } from './useShowQuickAdd'

const CO_INSURED_DATA_KEY = 'numberCoInsured'

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

const homeInsurances = ['SE_HOUSE', 'SE_APARTMENT_RENT', 'SE_APARTMENT_BRF', 'SE_STUDENT_APARTMENT']

export const QuickAddOfferContainer = (props: Props) => {
  const { t } = useTranslation('cart')
  const [show] = useShowQuickAdd()

  // Assume Accident insurance
  const householdSize = (parseInt(props.offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0) + 1

  // Only display "Home + Accident" and mainOfferPillow if Home insurance is in cart
  const homeInsuranceInCart =
    props.cart.entries.find((entry) => homeInsurances.includes(entry.product.name)) ?? null
  const title = homeInsuranceInCart
    ? t('QUICK_ADD_TITLE', { product: props.product.displayNameShort })
    : props.product.displayNameFull
  const subtitle = t('QUICK_ADD_HOUSEHOLD_SIZE', { count: householdSize })

  const price = getOfferPrice(props.offer.cost)

  if (!show) return null

  return (
    <QuickAdd
      title={title}
      subtitle={subtitle}
      pillow={props.product.pillowImage}
      mainOfferPillow={homeInsuranceInCart?.product.pillowImage}
      href={props.product.pageLink}
      price={price}
      Body={
        // Assume Accident insurance
        <Text as="p" color="textTranslucentSecondary">
          {t('ACCIDENT_OFFER_DESCRIPTION')}
        </Text>
      }
    >
      <AddToCartButton
        shopSessionId={props.shopSessionId}
        productName={props.product.name}
        offer={props.offer}
      />
      <DismissButton />
    </QuickAdd>
  )
}
