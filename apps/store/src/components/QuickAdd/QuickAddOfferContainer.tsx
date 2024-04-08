import { useTranslation } from 'next-i18next'
import { Heading, Text, theme } from 'ui'
import { Perils } from '@/components/Perils/Perils'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import {
  CartFragmentFragment,
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/graphql/generated'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
import { DismissButton } from './DismissButton'
import { ProductUsp, QuickAddBundleView } from './QuickAddBundleView'
import { QuickAddInfoDialog } from './QuickAddInfoDialog'
import { useShowQuickAdd } from './useShowQuickAdd'

const CO_INSURED_DATA_KEY = 'numberCoInsured'
const HOME_INSURANCES = [
  'SE_HOUSE',
  'SE_APARTMENT_RENT',
  'SE_APARTMENT_BRF',
  'SE_STUDENT_APARTMENT',
]

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export const QuickAddOfferContainer = (props: Props) => {
  const { t } = useTranslation('cart')
  const [show] = useShowQuickAdd()

  if (!show) return null

  // Assume Accident insurance
  const householdSize = (parseInt(props.offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0) + 1

  // Only display "Home + Accident" and mainOfferPillow if Home insurance is in cart
  const homeInsuranceInCart =
    props.cart.entries.find((entry) => HOME_INSURANCES.includes(entry.product.name)) ?? null
  const title = homeInsuranceInCart
    ? t('QUICK_ADD_TITLE', { product: props.product.displayNameShort })
    : props.product.displayNameFull
  const subtitle = t('QUICK_ADD_HOUSEHOLD_SIZE', { count: householdSize })

  const price = getOfferPrice(props.offer.cost)

  return (
    <QuickAddBundleView
      title={title}
      subtitle={subtitle}
      pillow={props.product.pillowImage}
      mainOfferPillow={homeInsuranceInCart?.product.pillowImage}
      href={props.product.pageLink}
      price={price}
      badge={{ children: t('QUICK_ADD_BADGE_LABEL') }}
      Body={
        // Assume Accident insurance
        <>
          <Text as="p" color="textTranslucentSecondary">
            {t('ACCIDENT_OFFER_DESCRIPTION_BUNDLE')}
            <QuickAddInfoDialog
              Header={
                <>
                  <Pillow size="xlarge" {...props.product.pillowImage} />
                  <Heading as="h1" variant="standard.18" mt={theme.space.md}>
                    {props.product.displayNameFull}
                  </Heading>
                  <Price color="textTranslucentSecondary" {...price} />
                </>
              }
            >
              <Perils items={props.offer.variant.perils} />
            </QuickAddInfoDialog>
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
  )
}
