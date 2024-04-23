import { useTranslation } from 'next-i18next'
import { Heading, Text, Space, theme } from 'ui'
import { Perils } from '@/components/Perils/Perils'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/graphql/generated'
import { Features } from '@/utils/Features'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { AddToCartButton } from './AddToCartButton'
import { DismissButton } from './DismissButton'
import { ProductUsp } from './ProductUsp'
import { QuickAddBundleView } from './QuickAddBundleView'
import { QuickAddEditableView } from './QuickAddEditableView'
import { QuickAddInfoDialog } from './QuickAddInfoDialog'
import { useShowQuickAdd } from './useShowQuickAdd'

const CO_INSURED_DATA_KEY = 'numberCoInsured'
const HOME_INSURANCES = [
  'SE_HOUSE',
  'SE_APARTMENT_RENT',
  'SE_APARTMENT_BRF',
  'SE_APARTMENT_STUDENT',
]
const ACCIDENT_INSURANCE = 'SE_ACCIDENT'

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export function QuickAddOfferContainer(props: Props) {
  const { t } = useTranslation('cart')
  const [show] = useShowQuickAdd()

  // We only support cross-selling of Accident insurance at the moment
  if (props.product.name !== ACCIDENT_INSURANCE) {
    console.log(`Cross sell | Unsupported product: ${props.product.name}`)
    return null
  }

  if (!show) return null

  const homeInsuranceInCart =
    props.cart.entries.find((entry) => HOME_INSURANCES.includes(entry.product.name)) ?? null
  if (!homeInsuranceInCart && Features.enabled('CROSS_SELL_CARD_V2')) {
    return (
      <QuickAddEditableView
        shopSessionId={props.shopSessionId}
        offer={props.offer}
        productName={props.product.name}
        pillow={props.product.pillowImage}
        title={props.product.displayNameFull}
        subtitle={t('USP_NO_BINDING_TIME')}
        productPageLink={props.product.pageLink}
        badge={t('QUICK_ADD_BADGE_LABEL')}
        Body={
          <ul>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_1')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_2')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_3')}</ProductUsp>
          </ul>
        }
      />
    )
  }

  const householdSize = parseInt(props.offer.priceIntentData[CO_INSURED_DATA_KEY] || 0, 10) + 1
  const title = homeInsuranceInCart
    ? t('QUICK_ADD_TITLE', { product: props.product.displayNameShort })
    : props.product.displayNameFull
  const subtitle = t('QUICK_ADD_HOUSEHOLD_SIZE', { count: householdSize })
  const price = getOfferPrice(props.offer.cost)
  const primaryPillow = homeInsuranceInCart
    ? homeInsuranceInCart.product.pillowImage
    : props.product.pillowImage
  const secondaryPillow = homeInsuranceInCart ? props.product.pillowImage : undefined

  return (
    <QuickAddBundleView
      title={title}
      subtitle={subtitle}
      primaryPillow={primaryPillow}
      secondaryPillow={secondaryPillow}
      href={props.product.pageLink}
      price={price}
      badge={{ children: t('QUICK_ADD_BADGE_LABEL') }}
      Body={
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
      Footer={
        <Space y={0.5}>
          <AddToCartButton
            shopSessionId={props.shopSessionId}
            productName={props.product.name}
            offer={props.offer}
            fullWidth={true}
          >
            {t('QUICK_ADD_BUTTON_BUNDLE')}
          </AddToCartButton>
          <DismissButton variant="ghost" fullWidth={true} />
        </Space>
      }
    />
  )
}
