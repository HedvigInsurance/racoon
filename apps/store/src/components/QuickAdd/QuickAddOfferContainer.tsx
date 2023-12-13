import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import {
  CartFragmentFragment,
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { Features } from '@/utils/Features'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
import { DismissButton } from './DismissButton'
import { QuickAdd } from './QuickAdd'
import { ProductUsp, QuickAddBundleView } from './QuickAddBundleView'
import { useShowQuickAdd } from './useShowQuickAdd'

const USE_QUICK_ADD_BUNDLE_VIEW = Features.enabled('QUICK_ADD_BUNDLE_VIEW')
const CO_INSURED_DATA_KEY = 'numberCoInsured'
const homeInsurances = ['SE_HOUSE', 'SE_APARTMENT_RENT', 'SE_APARTMENT_BRF', 'SE_STUDENT_APARTMENT']

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

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
    <>
      {USE_QUICK_ADD_BUNDLE_VIEW ? (
        <QuickAddBundleView
          title={title}
          subtitle={subtitle}
          pillow={props.product.pillowImage}
          mainOfferPillow={homeInsuranceInCart?.product.pillowImage}
          href={props.product.pageLink}
          price={price}
          Body={
            // Assume Accident insurance
            <>
              <Text as="p" color="textTranslucentSecondary">
                {t('ACCIDENT_OFFER_DESCRIPTION_BUNDLE')}
              </Text>
              <ul>
                <ProductUsp>{t('ACCIDENT_OFFER_USP_1')}</ProductUsp>
                <ProductUsp>{t('ACCIDENT_OFFER_USP_2')}</ProductUsp>
                <ProductUsp>{t('ACCIDENT_OFFER_USP_3')}</ProductUsp>
              </ul>
            </>
          }
        >
          <AddToCartButton
            shopSessionId={props.shopSessionId}
            productName={props.product.name}
            offer={props.offer}
          >
            {t('QUICK_ADD_BUTTON_BUNDLE')}
          </AddToCartButton>
          <DismissButton />
        </QuickAddBundleView>
      ) : (
        <QuickAdd
          title={props.product.displayNameFull}
          subtitle={subtitle}
          pillow={props.product.pillowImage}
          href={props.product.pageLink}
          price={price}
          Body={
            // Assume Accident insurance
            <>
              <Text as="p" color="textTranslucentSecondary">
                {t('ACCIDENT_OFFER_DESCRIPTION')}
              </Text>
            </>
          }
        >
          <AddToCartButton
            shopSessionId={props.shopSessionId}
            productName={props.product.name}
            offer={props.offer}
          >
            {t('QUICK_ADD_BUTTON')}
          </AddToCartButton>
          <DismissButton />
        </QuickAdd>
      )}
    </>
  )
}
